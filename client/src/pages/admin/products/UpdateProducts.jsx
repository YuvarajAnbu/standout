import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Filter from "@/features/catalog/components/filter/Filter";
import ShopItem from "@/pages/admin/products/components/ShopItem";
import "@/features/catalog/Shop.scss";
import products from "@/features/catalog/data/products";
import pluralize from "pluralize";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { useTimedMessages } from "@/shared/hooks/useTimedMessages";
import MessageBanner from "@/shared/components/ui/MessageBanner";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiRequest } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/queries";
import {
  createStockIndex,
  reconcileCatalogFilter,
} from "@/features/catalog/utils/catalog";
import { handleKeyboardActivation } from "@/shared/utils/accessibility";

const NO_MATCH = "__no_catalog_match__";
const NO_SEARCH = "__no_search__";

function UpdateProducts() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { uploadOptions } = products;

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const [catagory, setCatagory] = useState([]);
  const [type, setType] = useState([]);

  const [noResults, setNoResults] = useState(false);

  // getting colors and sizes from server on page load
  const [itemStock, setItemStock] = useState({
    colors: [],
    sizes: [],
  });

  // changing all product images based on color
  const [stockIndex, setStockIndex] = useState({});
  const limit = 12;

  // state for filter
  const [filter, setFilter] = useState({
    sort: "",
    color: [],
    size: [],
  });

  // hide filter on click
  const [hideFilter, setHideFilter] = useState({
    sort: true,
    color: true,
    size: true,
  });

  const [showFilters, setShowFilters] = useState(false);

  const [lastClicked, setLastClicked] = useState("");

  const [blackBox, setBlackBox] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1000px)");

  const {
    successMsgs,
    errorMsgs,
    showMsgs,
    setSuccessMsgs,
    setErrorMsgs,
    dismissMessages,
  } = useTimedMessages();

  const toggleMobileFilters = () => {
    setShowFilters((current) => !current);
    setBlackBox((current) => !current);
  };

  useEffect(() => {
    if (isDesktop && showFilters) {
      setBlackBox(false);
      setShowFilters(false);
    }
  }, [isDesktop, showFilters]);

  //set page to 0 when catagory changes

  // changing search query
  useEffect(() => {
    const query = searchParams.get("q")?.trim() || "";
    setSearch(query || NO_SEARCH);
    setInput(query);
  }, [searchParams]);

  const submitSearch = (event) => {
    event.preventDefault();
    const query = input.trim();
    if (!query) return;

    navigate(`/update-products?${new URLSearchParams({ q: query })}`);
  };

  // updating catagory and type
  useEffect(() => {
    if (search !== "") {
      let types = [];
      let catagories = [];

      const searchStr = search
        .trim()
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.{}[\]()/\\]/gi, "");

      const catagoryArr = {
        men: ["men", "man", "mens", "mans"],
        women: ["women", "woman", "womens", "womans"],
      };

      searchStr.split(" ").forEach((el) => {
        Object.keys(catagoryArr).forEach((e) => {
          catagoryArr[e].forEach((k) => {
            if (!catagories.includes(e)) {
              if (
                pluralize
                  .plural(k)
                  .toLowerCase()
                  .replace(/[`~!@#$%^&*()_|+\-=?;:'",.{}[\]()/\\]/gi, "") ===
                pluralize.plural(el).toLowerCase()
              ) {
                catagories.push(e);
              }
            }
          });
        });

        Object.keys(uploadOptions).forEach((e) => {
          if (e !== "both") {
            uploadOptions[e].forEach((k) => {
              if (!types.includes(el.toLowerCase())) {
                k.split(" ").forEach((j) => {
                  if (
                    pluralize
                      .plural(j)
                      .toLowerCase()
                      .replace(
                        /[`~!@#$%^&*()_|+\-=?;:'",.{}[\]()/\\]/gi,
                        ""
                      ) === pluralize.plural(el).toLowerCase()
                  ) {
                    types.push(k.toLowerCase());
                  }
                });
              }
            });
          }
        });
      });

      if (types.length < 1) {
        types = [NO_MATCH];
      }

      if (catagories.length < 1) {
        catagories = [NO_MATCH];
      }
      setCatagory(catagories);
      setType(types);
    }
  }, [search, uploadOptions]);

  const reset = useCallback(() => {
    setHideFilter({
      sort: true,
      color: true,
      size: true,
    });
    setFilter({
      sort: "",
      color: [],
      size: [],
    });
    setLastClicked("");
    setNoResults(false);
  }, []);

  useEffect(reset, [search, reset]);

  const productsQuery = useInfiniteQuery({
    queryKey: queryKeys.products({
      adminSearch: search,
      catagory,
      type,
      filter,
      lastClicked,
    }),
    initialPageParam: 1,
    enabled: catagory.length > 0 && type.length > 0 && !noResults,
    queryFn: ({ pageParam, signal }) =>
      apiRequest(
        `/product/${catagory}/${type}?${new URLSearchParams({
          page: pageParam,
          limit,
          sort: filter.sort,
          color: filter.color.join(","),
          size: filter.size.join(","),
          filter: lastClicked,
          includeFilters: pageParam === 1,
          q: search === NO_SEARCH ? "" : search,
        })}`,
        { signal },
      ),
    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.reduce(
        (total, pageData) => total + pageData.products.length,
        0,
      );
      return loaded < lastPage.count ? pages.length + 1 : undefined;
    },
  });
  const serverProducts = useMemo(
    () => productsQuery.data?.pages.flatMap((pageData) => pageData.products) || [],
    [productsQuery.data],
  );
  const items = serverProducts;
  const itemsCount = productsQuery.data?.pages[0]?.count || 0;

  useEffect(() => setStockIndex(createStockIndex(items)), [items]);

  const firstPage = productsQuery.data?.pages[0];
  useEffect(() => {
    if (!firstPage) return;
    setItemStock((current) => ({ ...current, ...firstPage.filters }));
    const nextFilter = reconcileCatalogFilter(filter, firstPage.filters);
    if (nextFilter !== filter) {
      setFilter(nextFilter);
    } else if (firstPage.count === 0) {
      setNoResults(true);
    }
  }, [filter, firstPage]);


  const limitArr = () => {
    let arr = [];
    for (var i = 0; i < limit; i++) {
      arr.push(i);
    }
    return arr;
  };

  return (
    <div className="shop">
      <title>Update Products | Stand Out</title>
      <MessageBanner message={errorMsgs} type="error" visible={showMsgs} onDismiss={dismissMessages} />
      <MessageBanner message={successMsgs} type="success" visible={showMsgs} onDismiss={dismissMessages} />
      <Filter
        {...{
          filter,
          setFilter,
          itemStock,
          hideFilter,
          setHideFilter,
          showFilters,
          setShowFilters,
          setBlackBox,
          noResults,
          setLastClicked,
        }}
      />
      <div className="shop__items-container">
        <div className="shop__items-container__search-container">
          <svg
            className="shop__items-container__search-container__icon"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="32"
            height="32"
            viewBox="0 0 30 30"
            style={{ fill: "#ffffff" }}
          >
            <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
          </svg>
          <form onSubmit={submitSearch}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              required
            />
            <button type="submit" hidden aria-label="Search products" />
          </form>
        </div>
        <div
          className="shop__items-container__title"
          style={
            noResults
              ? {
                  borderBottom: "1px solid #dddddd",
                  paddingBottom: "2rem",
                }
              : {}
          }
        >
          {search !== NO_SEARCH ? (
            <h1
              className={
                noResults ? "shop__items-container__title__no-result" : ""
              }
            >
              <span>
                {noResults ? "We couldn't find anything for" : "Results For"}
              </span>{" "}
              "{search}"
            </h1>
          ) : (
            <h1 className="shop__items-container__title__no-result">
              <span>Search For Something</span>
            </h1>
          )}
          {!noResults && (
            <p
              role="button"
              tabIndex={0}
              aria-expanded={showFilters}
              onClick={toggleMobileFilters}
              onKeyDown={(event) =>
                handleKeyboardActivation(event, toggleMobileFilters)
              }
            >
              filter
              <FontAwesomeIcon className="icon" icon="chevron-right" />
            </p>
          )}
        </div>
        {!noResults && (
          <div>
            {productsQuery.isPending ? (
              <div className="shop__loading__box">
                {limitArr().map((index) => (
                  <div
                    key={index}
                    className="shop__loading__container shop__loading__container--item"
                  >
                    <div className="shop__loading__container__img"></div>
                    <div className="shop__loading__container__text shop__loading__container__text--name"></div>
                    <div className="shop__loading__container__text"></div>
                    <div className="shop__loading__container__text"></div>
                  </div>
                ))}
              </div>
            ) : productsQuery.isError ? (
              <p role="alert">Products could not be loaded. Please try again.</p>
            ) : (
              <div className="shop__items-container__items">
                {items.map((el, index) => (
                  <ShopItem
                    key={el._id}
                    {...{
                      el,
                      stockIndex,
                      index,
                      setStockIndex,
                      setErrorMsgs,
                      setSuccessMsgs,
                    }}
                  />
                ))}
              </div>
            )}

            {items.length > 0 && (
              <div>
                <p className="shop__items-container__count">
                  {`${items.length}/${itemsCount} products`}
                </p>
                {productsQuery.hasNextPage && (
                  <button
                    className={
                      productsQuery.isFetchingNextPage
                        ? "shop__items-container__load-more shop__items-container__load-more--loading"
                        : "shop__items-container__load-more"
                    }
                    type="button"
                    onClick={() => productsQuery.fetchNextPage()}
                    disabled={productsQuery.isFetchingNextPage}
                  >
                    {productsQuery.isFetchingNextPage ? (
                      <div className="shop__items-container__load-more__loading"></div>
                    ) : (
                      "load more"
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className={
          blackBox
            ? "shop__black-box shop__black-box--visible"
            : "shop__black-box"
        }
        onClick={() => {
          setShowFilters(false);
          setBlackBox(false);
        }}
      ></div>
    </div>
  );
}

export default UpdateProducts;

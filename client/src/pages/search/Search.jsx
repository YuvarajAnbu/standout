import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Filter from "@/features/catalog/components/filter/Filter";
import ShopItem from "@/features/catalog/components/ShopItem";
import "@/features/catalog/Shop.scss";
import products from "@/features/catalog/data/products";
import pluralize from "pluralize";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiRequest } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/queries";
import {
  createStockIndex,
  reconcileCatalogFilter,
} from "@/features/catalog/utils/catalog";
import { handleKeyboardActivation } from "@/shared/utils/accessibility";

const NO_MATCH = "__no_catalog_match__";

function Search() {
  const [searchParams] = useSearchParams();
  const { uploadOptions } = products;
  const [search, setSearch] = useState("");

  const [catagory, setCatagory] = useState([]);
  const [type, setType] = useState([]);

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
  const [lastClicked, setLastClicked] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const [noResults, setNoResults] = useState(false);

  const [blackBox, setBlackBox] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1000px)");

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

  // changing search query
  useEffect(() => {
    setSearch(searchParams.get("q")?.trim() || "");
  }, [searchParams]);

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
                        "",
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

  //reset when search changes

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

  const showingRecommendations = noResults;
  const catalogPath = showingRecommendations
    ? "best-seller"
    : `${catagory}/${type}`;
  const productsQuery = useInfiniteQuery({
    queryKey: queryKeys.products({
      search,
      catalogPath,
      filter,
      lastClicked,
    }),
    initialPageParam: 1,
    enabled: catagory.length > 0 && type.length > 0,
    queryFn: ({ pageParam, signal }) =>
      apiRequest(
        `/product/${catalogPath}?${new URLSearchParams({
          page: pageParam,
          limit,
          sort: filter.sort,
          color: filter.color.join(","),
          size: filter.size.join(","),
          filter: lastClicked,
          includeFilters: pageParam === 1,
          ...(showingRecommendations ? {} : { q: search }),
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
    () =>
      productsQuery.data?.pages.flatMap((pageData) => pageData.products) || [],
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
      <title>{search ? `${search} | Stand Out` : "Search | Stand Out"}</title>
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
          setLastClicked,
        }}
        noResults={showingRecommendations}
      />
      <div className="shop__items-container">
        <div
          className="shop__items-container__title"
          style={showingRecommendations ? { borderBottom: "none" } : {}}
        >
          <h1
            className={
              showingRecommendations
                ? "shop__items-container__title__no-result"
                : ""
            }
          >
            <span>
              {showingRecommendations
                ? "We couldn't find anything for"
                : "Results For"}
            </span>{" "}
            "{search}"
          </h1>
          {!showingRecommendations && (
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
        {showingRecommendations && (
          <p className="shop__items-container__no-result">
            recommended for you
          </p>
        )}
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
                {...{ el, stockIndex, index, setStockIndex }}
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

export default Search;

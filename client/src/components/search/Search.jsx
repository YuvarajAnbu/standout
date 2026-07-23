import React, {
  useEffect,
  useState,
  useCallback,
  useEffectEvent,
  useMemo,
} from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cachedGet } from "../../api/queries";
import Filter from "../shop/subComponents/filter/Filter";
import ShopItem from "../shop/subComponents/ShopItem";
import "../shop/Shop.css";
import { useAppStore } from "../../store/useAppStore";
import products from "../../state/products";
import pluralize from "pluralize";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiRequest } from "../../api/client";
import { queryKeys } from "../../api/queries";
import {
  createStockIndex,
  filterLocalProducts,
  sortCatalogProducts,
} from "../../utils/catalog";
import { reportError } from "../../utils/logger";
import { handleKeyboardActivation } from "../../utils/accessibility";

const NO_MATCH = "__no_catalog_match__";

function Search() {
  const [searchParams] = useSearchParams();
  const userProducts = useAppStore((state) => state.userProducts);
  const hideProducts = useAppStore((state) => state.hideProducts);
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

  const [update, setUpdate] = useState(0);
  const toggleMobileFilters = () => {
    setShowFilters((current) => !current);
    setBlackBox((current) => !current);
  };

  useEffect(() => {
    if (search !== "") {
      document.title = `${search} | Stand Out`;
    }
  }, [search]);

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
      setUpdate((prev) => prev + 1);
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
      setUpdate((prev) => prev + 1);
  }, []);

  useEffect(reset, [search, reset]);

  const catalogPath =
    noResults || (catagory.includes(NO_MATCH) && type.includes(NO_MATCH))
      ? "best-seller"
      : `${catagory}/${type}`;
  const localProducts = useMemo(
    () =>
      noResults
        ? []
        : filterLocalProducts(userProducts, {
            categories: catagory[0] === NO_MATCH ? [] : catagory,
            types: type[0] === NO_MATCH ? [] : type,
            filter,
          }),
    [catagory, filter, noResults, type, userProducts],
  );
  const productsQuery = useInfiniteQuery({
    queryKey: queryKeys.products({
      search,
      catalogPath,
      filter,
      hideProducts,
    }),
    initialPageParam: 1,
    enabled: catagory.length > 0 && type.length > 0,
    queryFn: ({ pageParam, signal }) =>
      apiRequest(
        `/product/${catalogPath}?page=${pageParam}&limit=${limit}&sort=${filter.sort}&color=${filter.color}&size=${filter.size}&except=${hideProducts}`,
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
  const items = useMemo(() => {
    const combined = [...sortCatalogProducts(localProducts), ...serverProducts];
    return filter.sort ? sortCatalogProducts(combined, filter.sort) : combined;
  }, [filter.sort, localProducts, serverProducts]);
  const itemsCount =
    (productsQuery.data?.pages[0]?.count || 0) + localProducts.length;

  useEffect(() => setStockIndex(createStockIndex(items)), [items]);

  const getFilters = useCallback(() => {
    if (catagory.length > 0 && type.length > 0) {
      let str = `${catagory}/${type}`;
      if (
        (catagory.includes(NO_MATCH) && type.includes(NO_MATCH)) ||
        noResults
      ) {
        setNoResults(true);
        str = "best-seller";
      }
      cachedGet(
          `/product/filter/${str}?&color=${filter.color}&size=${filter.size}&filter=${lastClicked}&except=${hideProducts}`,
          { scope: "search-results", cancelPrevious: true, staleTime: 0 }
        )
        .then((res) => {
          if (Object.keys(res.data).length < 1) {
            setNoResults(true);
            setUpdate((prev) => prev + 1);
          } else {
            //for client use
            if (str.split("/").length === 2) {
              const filterObj = {};

              if (catagory[0] !== NO_MATCH) {
                filterObj.catagory = [...catagory, "both"];
              }
              if (type[0] !== NO_MATCH) {
                filterObj.type = [...type];
              }

              let products = [];

              if (Object.keys(filterObj).length === 2) {
                products = userProducts.filter(
                  (e) =>
                    filterObj.catagory.includes(e.catagory) &&
                    filterObj.type.includes(e.type)
                );
              } else if (Object.keys(filterObj).length === 1) {
                products = userProducts.filter((e) =>
                  filterObj[Object.keys(filterObj)[0]].includes(
                    e[Object.keys(filterObj)[0]]
                  )
                );
              }
              let filteredProducts = [];
              if (filter.color.length < 1 && filter.size.length < 1) {
                filteredProducts = products;
              } else {
                if (
                  !(lastClicked.includes("color") && filter.color.length > 0) &&
                  !(lastClicked.includes("size") && filter.size.length > 0)
                ) {
                  filteredProducts = products;
                } else {
                  for (let i = 0; i < products.length; i++) {
                    for (let j = 0; j < products[i].stock.length; j++) {
                      if (
                        filteredProducts.filter(
                          (el) => el._id === products[i]._id
                        ).length > 0
                      ) {
                        break;
                      }
                      if (
                        filter.color.includes(
                          products[i].stock[j].color.replace("#", "")
                        ) &&
                        lastClicked.includes("color") &&
                        filter.color.length > 0
                      ) {
                        filteredProducts.push(products[i]);
                        break;
                      }
                      if (
                        lastClicked.includes("size") &&
                        filter.size.length > 0
                      ) {
                        for (
                          let k = 0;
                          k < products[i].stock[j].sizeRemaining.length;
                          k++
                        ) {
                          if (
                            filter.size.includes(
                              products[i].stock[j].sizeRemaining[k].size
                            )
                          ) {
                            filteredProducts.push(products[i]);
                            break;
                          }
                        }
                      }
                    }
                  }
                }
              }
              const filterArr = {
                colors: [],
                sizes: [],
              };
              filteredProducts.forEach(({ stock }) => {
                stock.forEach((item) => {
                  if (
                    !lastClicked.includes("color") ||
                    (filter.size.length === 0 && lastClicked.includes("size"))
                  ) {
                    if (!filterArr.colors.includes(item.color)) {
                      filterArr.colors.push(item.color);
                    }
                  }
                  if (
                    !lastClicked.includes("size") ||
                    (filter.color.length === 0 && lastClicked.includes("color"))
                  ) {
                    item.sizeRemaining.forEach(({ size }) => {
                      if (!filterArr.sizes.includes(size)) {
                        filterArr.sizes.push(size);
                      }
                    });
                  }
                });
              });
              const filteredArr = {
                colors: [...res.data.colors],
                sizes: [...res.data.sizes],
              };
              Object.keys(filterArr).forEach((el) => {
                filterArr[el].forEach((e) => {
                  if (!filteredArr[el].includes(e)) {
                    filteredArr[el].push(e);
                  }
                });
              });

              res.data = filteredArr;

              Object.keys(res.data).forEach((el) => {
                if (res.data[el].length < 1) {
                  delete res.data[el];
                }
              });
            }

            setFilter((prev) => {
              const next = { ...prev };
              Object.keys(res.data).forEach((el) => {
                if (el === "sizes") {
                  next.size = prev.size.filter((k) => res.data[el].includes(k));
                } else if (el === "colors") {
                  next.color = prev.color.filter((k) =>
                    res.data[el].includes("#" + k)
                  );
                }
              });

              return next;
            });
            setItemStock((prev) => {
              return {
                ...prev,
                ...res.data,
              };
            });
          }
        })
        .catch((error) => reportError(error, { area: "search filters" }));
    }
  }, [
    filter,
    lastClicked,
    catagory,
    type,
    noResults,
    userProducts,
    hideProducts,
  ]);

  const runGetFilters = useEffectEvent(getFilters);
  useEffect(() => runGetFilters(), [update]);

  const limitArr = () => {
    let arr = [];
    for (var i = 0; i < limit; i++) {
      arr.push(i);
    }
    return arr;
  };

  return (
    <div className="shop">
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
          setUpdate,
        }}
      />
      <div className="shop__items-container">
        <div
          className="shop__items-container__title"
          style={noResults ? { borderBottom: "none" } : {}}
        >
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
        </div>
        {noResults && (
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

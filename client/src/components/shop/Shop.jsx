import React, {
  useState,
  useEffect,
  useCallback,
  useEffectEvent,
  useMemo,
} from "react";
import "./Shop.css";
import { cachedGet } from "../../api/queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiRequest } from "../../api/client";
import { queryKeys } from "../../api/queries";
import Filter from "./subComponents/filter/Filter";
import ShopItem from "./subComponents/ShopItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppStore } from "../../store/useAppStore";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import {
  createStockIndex,
  filterLocalProducts,
  sortCatalogProducts,
} from "../../utils/catalog";
import { reportError } from "../../utils/logger";
import { handleKeyboardActivation } from "../../utils/accessibility";

function Shop({ title, link }) {
  // const history = useHistory();
  const userProducts = useAppStore((state) => state.userProducts);
  const hideProducts = useAppStore((state) => state.hideProducts);

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

  const [blackBox, setBlackBox] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1000px)");

  const [update, setUpdate] = useState(0);

  const [noRes, setNoRes] = useState(false);
  const toggleMobileFilters = () => {
    setShowFilters((current) => !current);
    setBlackBox((current) => !current);
  };

  useEffect(() => {
    document.title = `${title} | Stand Out`;
  }, [title]);

  useEffect(() => {
    if (isDesktop && showFilters) {
      setBlackBox(false);
      setShowFilters(false);
    }
  }, [isDesktop, showFilters]);

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
    setUpdate((prev) => prev + 1);
    setNoRes(false);
  }, []);

  useEffect(reset, [link, reset]);

  const routeParts = useMemo(() => link.split("/"), [link]);
  const localProducts = useMemo(
    () =>
      routeParts.length === 2
        ? filterLocalProducts(userProducts, {
            categories: routeParts[0],
            types: routeParts[1],
            filter,
          })
        : [],
    [filter, routeParts, userProducts],
  );

  const productsQuery = useInfiniteQuery({
    queryKey: queryKeys.products({ link, filter, hideProducts }),
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      apiRequest(
        `/product/${link}?page=${pageParam}&limit=${limit}&sort=${filter.sort}&color=${filter.color}&size=${filter.size}&except=${hideProducts}`,
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
    cachedGet(
        `/product/filter/${link}?&color=${filter.color}&size=${filter.size}&filter=${lastClicked}&except=${hideProducts}`,
        { scope: "shop-results", cancelPrevious: true, staleTime: 0 }
      )
      .then((res) => {
        //for client use
        if (link.split("/").length === 2) {
          const products = userProducts.filter(
            (el) =>
              (el.catagory === link.split("/")[0] || el.catagory === "both") &&
              el.type === link.split("/")[1]
          );
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
                    filteredProducts.filter((el) => el._id === products[i]._id)
                      .length > 0
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
                  if (lastClicked.includes("size") && filter.size.length > 0) {
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

        if (Object.keys(res.data).length > 0) {
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
        } else {
          setNoRes(true);
          // history.replace("/404");
          // navigate("/404", { replace: true });
        }
      })
      .catch((error) => reportError(error, { area: "shop filters" }));
  }, [
    filter,
    lastClicked,
    link,
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
          hide: noRes,
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
        {noRes ? (
          <div className="shop__items-container__title">
            <h1>No result for {title}</h1>
          </div>
        ) : (
          <>
            <div className="shop__items-container__title">
              <h1>{title}</h1>
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
          </>
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

export default Shop;

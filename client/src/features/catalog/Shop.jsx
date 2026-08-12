import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import "@/features/catalog/Shop.scss";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiRequest } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/queries";
import Filter from "@/features/catalog/components/filter/Filter";
import ShopItem from "@/features/catalog/components/ShopItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import {
  createStockIndex,
  reconcileCatalogFilter,
} from "@/features/catalog/utils/catalog";
import { handleKeyboardActivation } from "@/shared/utils/accessibility";

function Shop({ title, link }) {
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

  const [noRes, setNoRes] = useState(false);
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
    setNoRes(false);
  }, []);

  useEffect(reset, [link, reset]);

  const productsQuery = useInfiniteQuery({
    queryKey: queryKeys.products({ link, filter, lastClicked }),
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      apiRequest(
        `/product/${link}?page=${pageParam}&limit=${limit}&sort=${filter.sort}&color=${filter.color}&size=${filter.size}&filter=${lastClicked}&includeFilters=${pageParam === 1}`,
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
      setNoRes(true);
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
      <title>{title} | Stand Out</title>
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

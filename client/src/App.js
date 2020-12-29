import React, {
  createContext,
  useState,
  useEffect,
  lazy,
  Suspense,
} from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSearch,
  faUser,
  faShoppingCart,
  faPen,
  faTrash,
  faEye,
  faEyeSlash,
  faCloudUploadAlt,
  faPlus,
  faMinus,
  faTimes,
  faStar,
  faStarHalf,
  faCheckSquare,
  faChevronRight,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faSquare,
  faTimesCircle,
  faCheckCircle,
} from "@fortawesome/free-regular-svg-icons";
import {
  faFacebookSquare,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import products from "./state/products";
import usStates from "./state/states";
import colors from "./state/colors";
import ErrorBoundary from "./ErrorBoundary";
const Header = lazy(() => import("./components/header/Header"));
const Home = lazy(() => import("./components/home/Home"));
const Items = lazy(() => import("./components/items/Items"));
const Item = lazy(() => import("./components/item/Item"));
const Billing = lazy(() => import("./components/billing/Billing"));
const SignUp = lazy(() => import("./components/signupAndSignin/SignUp"));
const SignIn = lazy(() => import("./components/signupAndSignin/SignIn"));
const UploadItem = lazy(() => import("./components/upload/UploadItem"));
const Checkout = lazy(() => import("./components/checkout/Checkout"));
const Search = lazy(() => import("./components/search/Search"));
const UpdateProducts = lazy(() =>
  import("./components/updateProducts/UpdateProducts")
);
const EditProduct = lazy(() => import("./components/editProduct/EditProduct"));
const Trending = lazy(() => import("./components/trending/Trending"));
const BestSeller = lazy(() => import("./components/bestSeller/BestSeller"));
const PersonalInfo = lazy(() =>
  import("./components/personalInfo/PersonalInfo")
);
const YourOrders = lazy(() => import("./components/yourOrders/YourOrders"));
const UpdateOrder = lazy(() => import("./components/updateOrder/UpdateOrder"));
const Footer = lazy(() => import("./components/footer/Footer"));
const TermsAndConditions = lazy(() =>
  import("./components/footer/subComponents/TermsAndConditions")
);
const PrivatePolicy = lazy(() =>
  import("./components/footer/subComponents/PrivatePolicy")
);
const Accessibility = lazy(() =>
  import("./components/footer/subComponents/Accessibility")
);
const WrongPage = lazy(() => import("./components/404/WrongPage"));

export const ProductsContext = createContext();
export const UserContext = createContext();
export const CartContext = createContext();
export const StateContext = createContext();
export const ColorsContext = createContext();
export const PathContext = createContext();
export const OrdersContext = createContext();
export const HideOrdersContext = createContext();
export const UserProductsContext = createContext();
export const HideProductsContext = createContext();
export const UserCountContext = createContext();
export const ReviewsContext = createContext();
export const HideReviewsContent = createContext();

function App() {
  library.add(
    faSearch,
    faUser,
    faShoppingCart,
    faPen,
    faTrash,
    faEye,
    faEyeSlash,
    faCloudUploadAlt,
    faPlus,
    faMinus,
    faTimes,
    faStar,
    faStarHalf,
    faSquare,
    faCheckSquare,
    faCheckCircle,
    faTimesCircle,
    faChevronRight,
    faCircle,
    faYoutube,
    faTwitter,
    faInstagram,
    faFacebookSquare
  );

  const [user, setUser] = useState({});
  const [cart, setCart] = useState([]);
  const [path, setPath] = useState("");
  const [loaded, setLoaded] = useState(true);

  const [orders, setOrders] = useState([]);
  const [hideOrders, setHideOrders] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [hideProducts, setHideProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [hideReviews, setHideReviews] = useState([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    document.querySelector("body").style.paddingRight = 0;
    document.querySelector("html").style.overflowY = "scroll";
    axios
      .get("/user/authenticate")
      .then((res) => {
        if (res.status !== 200) {
          throw new Error();
        }
        setUser(res.data.user);
        setLoaded(false);
      })
      .catch((err) => {
        setLoaded(false);
      });

    if (localStorage.getItem("cart")) {
      setCart(JSON.parse(localStorage.getItem("cart")));
    }
    if (localStorage.getItem("orders")) {
      setOrders(JSON.parse(localStorage.getItem("orders")));
    }
    if (localStorage.getItem("hideOrders")) {
      setHideOrders(JSON.parse(localStorage.getItem("hideOrders")));
    }
    if (localStorage.getItem("userProducts")) {
      setUserProducts(JSON.parse(localStorage.getItem("userProducts")));
    }
    if (localStorage.getItem("hideProducts")) {
      setHideProducts(JSON.parse(localStorage.getItem("hideProducts")));
    }
    if (localStorage.getItem("reviews")) {
      setReviews(JSON.parse(localStorage.getItem("reviews")));
    }
    if (localStorage.getItem("hideReviews")) {
      setHideReviews(JSON.parse(localStorage.getItem("hideReviews")));
    }
    if (localStorage.getItem("userCount")) {
      setUserCount(JSON.parse(localStorage.getItem("userCount")));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("hideOrders", JSON.stringify(hideOrders));
  }, [hideOrders]);

  useEffect(() => {
    localStorage.setItem("userProducts", JSON.stringify(userProducts));
  }, [userProducts]);

  useEffect(() => {
    localStorage.setItem("hideProducts", JSON.stringify(hideProducts));
  }, [hideProducts]);

  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem("hideReviews", JSON.stringify(hideReviews));
  }, [hideReviews]);

  useEffect(() => {
    localStorage.setItem("userCount", JSON.stringify(userCount));
  }, [userCount]);

  return (
    <Router>
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          }
        >
          {loaded ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <ProductsContext.Provider value={products}>
              <UserContext.Provider value={{ user, setUser }}>
                <CartContext.Provider value={{ cart, setCart }}>
                  <OrdersContext.Provider value={{ orders, setOrders }}>
                    <HideOrdersContext.Provider
                      value={{ hideOrders, setHideOrders }}
                    >
                      <UserProductsContext.Provider
                        value={{ userProducts, setUserProducts }}
                      >
                        <HideProductsContext.Provider
                          value={{ hideProducts, setHideProducts }}
                        >
                          <ReviewsContext.Provider
                            value={{ reviews, setReviews }}
                          >
                            <HideReviewsContent.Provider
                              value={{ hideReviews, setHideReviews }}
                            >
                              <UserCountContext.Provider
                                value={{ userCount, setUserCount }}
                              >
                                <PathContext.Provider value={{ path, setPath }}>
                                  <StateContext.Provider value={usStates}>
                                    <ColorsContext.Provider value={colors}>
                                      <Header />
                                      <Switch>
                                        <Route path="/" exact>
                                          <Home />
                                        </Route>
                                        <Route path="/signup" exact>
                                          <SignUp />
                                        </Route>
                                        <Route path="/signin" exact>
                                          <SignIn />
                                        </Route>
                                        <Route
                                          path="/items/:catagory/:type"
                                          exact
                                        >
                                          <Items />
                                        </Route>
                                        <Route path="/item/:id" exact>
                                          <Item />
                                        </Route>
                                        <Route path="/checkout" exact>
                                          <Checkout />
                                        </Route>
                                        <Route path="/your-orders" exact>
                                          <YourOrders />
                                        </Route>
                                        <Route path="/orders" exact>
                                          <YourOrders />
                                        </Route>
                                        <Route path="/search" exact>
                                          <Search />
                                        </Route>

                                        {user.type === "admin" && (
                                          <Route path="/upload" exact>
                                            <UploadItem />
                                          </Route>
                                        )}
                                        {user.type === "admin" && (
                                          <Route path="/update-products" exact>
                                            <UpdateProducts />
                                          </Route>
                                        )}
                                        {user.type === "admin" && (
                                          <Route path="/edit-item/:id" exact>
                                            <EditProduct />
                                          </Route>
                                        )}
                                        {user.type === "admin" && (
                                          <Route path="/update-order" exact>
                                            <UpdateOrder />
                                          </Route>
                                        )}
                                        <Route
                                          path="/terms-and-conditions"
                                          exact
                                        >
                                          <TermsAndConditions />
                                        </Route>
                                        <Route path="/private-policy" exact>
                                          <PrivatePolicy />
                                        </Route>
                                        <Route path="/accessibility" exact>
                                          <Accessibility />
                                        </Route>
                                        <Route path="/personal-info" exact>
                                          <PersonalInfo />
                                        </Route>
                                        <Route
                                          path="/shipping-and-billing"
                                          exact
                                        >
                                          <Billing />
                                        </Route>
                                        <Route path="/trending" exact>
                                          <Trending />
                                        </Route>
                                        <Route path="/best-sellers" exact>
                                          <BestSeller />
                                        </Route>
                                        <Route>
                                          <WrongPage />
                                        </Route>
                                      </Switch>
                                      <Footer />
                                    </ColorsContext.Provider>
                                  </StateContext.Provider>
                                </PathContext.Provider>
                              </UserCountContext.Provider>
                            </HideReviewsContent.Provider>
                          </ReviewsContext.Provider>
                        </HideProductsContext.Provider>
                      </UserProductsContext.Provider>
                    </HideOrdersContext.Provider>
                  </OrdersContext.Provider>
                </CartContext.Provider>
              </UserContext.Provider>
            </ProductsContext.Provider>
          )}
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;

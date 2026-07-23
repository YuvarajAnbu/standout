import React, { useEffect, lazy, Suspense } from "react";
import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import ErrorBoundary from "./ErrorBoundary";
import { authQueryOptions } from "./api/queries";
import { useAppStore } from "./store/useAppStore";
import AdminRoute from "./components/routing/AdminRoute";
import { unlockPageScroll } from "./utils/pageScroll";
const Header = lazy(() => import("./components/header/Header"));
const Home = lazy(() => import("./components/Pages/home/Home"));
const Items = lazy(() => import("./components/items/Items"));
const Item = lazy(() => import("./components/item/Item"));
const Billing = lazy(() => import("./components/billing/Billing"));
const SignUp = lazy(() => import("./components/signupAndSignin/SignUp"));
const SignIn = lazy(() => import("./components/signupAndSignin/SignIn"));
const UploadItem = lazy(() => import("./components/upload/UploadItem"));
const Checkout = lazy(() => import("./components/checkout/Checkout"));
const Search = lazy(() => import("./components/search/Search"));
const UpdateProducts = lazy(
  () => import("./components/updateProducts/UpdateProducts"),
);
const EditProduct = lazy(() => import("./components/editProduct/EditProduct"));
const Trending = lazy(() => import("./components/Pages/trending/Trending"));
const BestSeller = lazy(() => import("./components/Pages/bestSeller/BestSeller"));
const PersonalInfo = lazy(
  () => import("./components/personalInfo/PersonalInfo"),
);
const YourOrders = lazy(() => import("./components/yourOrders/YourOrders"));
const UpdateOrder = lazy(() => import("./components/updateOrder/UpdateOrder"));
const Footer = lazy(() => import("./components/footer/Footer"));
const TermsAndConditions = lazy(
  () => import("./components/footer/subComponents/TermsAndConditions"),
);
const PrivatePolicy = lazy(
  () => import("./components/footer/subComponents/PrivatePolicy"),
);
const Accessibility = lazy(
  () => import("./components/footer/subComponents/Accessibility"),
);
const WrongPage = lazy(() => import("./components/Pages/404/WrongPage"));

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
  faFacebookSquare,
);

function App() {
  const setUser = useAppStore((state) => state.setUser);
  const authQuery = useQuery(authQueryOptions());

  useEffect(() => {
    unlockPageScroll();
  }, []);

  useEffect(() => {
    if (authQuery.data) setUser(authQuery.data.user || {});
    if (authQuery.isError) setUser({});
  }, [authQuery.data, authQuery.isError, setUser]);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          }
        >
          <Header />
          {authQuery.isPending ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/items/:catagory/:type" element={<Items />} />
              <Route path="/item/:id" element={<Item />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/your-orders" element={<YourOrders />} />
              <Route path="/orders" element={<YourOrders />} />
              <Route path="/search" element={<Search />} />
              <Route
                path="/upload"
                element={
                  <AdminRoute>
                    <UploadItem />
                  </AdminRoute>
                }
              />
              <Route
                path="/update-products"
                element={
                  <AdminRoute>
                    <UpdateProducts />
                  </AdminRoute>
                }
              />
              <Route
                path="/edit-item/:id"
                element={
                  <AdminRoute>
                    <EditProduct />
                  </AdminRoute>
                }
              />
              <Route
                path="/update-order"
                element={
                  <AdminRoute>
                    <UpdateOrder />
                  </AdminRoute>
                }
              />
              <Route
                path="/terms-and-conditions"
                element={<TermsAndConditions />}
              />
              <Route path="/private-policy" element={<PrivatePolicy />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/personal-info" element={<PersonalInfo />} />
              <Route path="/shipping-and-billing" element={<Billing />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/best-sellers" element={<BestSeller />} />
              <Route path="*" element={<WrongPage />} />
            </Routes>
          )}
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;

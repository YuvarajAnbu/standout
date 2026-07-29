import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AdminRoute from "@/app/routing/AdminRoute";

const Home = lazy(() => import("@/pages/home/Home"));
const Items = lazy(() => import("@/pages/catalog/Items"));
const Item = lazy(() => import("@/pages/product/Item"));
const Billing = lazy(() => import("@/pages/checkout/Billing"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));
const SignIn = lazy(() => import("@/pages/auth/SignIn"));
const UploadItem = lazy(() => import("@/pages/admin/upload-product/UploadItem"));
const Checkout = lazy(() => import("@/pages/cart/Checkout"));
const Search = lazy(() => import("@/pages/search/Search"));
const UpdateProducts = lazy(
  () => import("@/pages/admin/products/UpdateProducts"),
);
const EditProduct = lazy(() => import("@/pages/admin/edit-product/EditProduct"));
const Trending = lazy(() => import("@/pages/trending/Trending"));
const BestSeller = lazy(() => import("@/pages/best-sellers/BestSeller"));
const PersonalInfo = lazy(
  () => import("@/pages/account/personal-info/PersonalInfo"),
);
const YourOrders = lazy(() => import("@/pages/account/orders/YourOrders"));
const UpdateOrder = lazy(() => import("@/pages/admin/update-order/UpdateOrder"));
const TermsAndConditions = lazy(
  () => import("@/pages/legal/TermsAndConditions"),
);
const PrivatePolicy = lazy(() => import("@/pages/legal/PrivatePolicy"));
const Accessibility = lazy(() => import("@/pages/legal/Accessibility"));
const WrongPage = lazy(() => import("@/pages/not-found/WrongPage"));

function AppRouter() {
  return (
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
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/private-policy" element={<PrivatePolicy />} />
      <Route path="/accessibility" element={<Accessibility />} />
      <Route path="/personal-info" element={<PersonalInfo />} />
      <Route path="/shipping-and-billing" element={<Billing />} />
      <Route path="/trending" element={<Trending />} />
      <Route path="/best-sellers" element={<BestSeller />} />
      <Route path="*" element={<WrongPage />} />
    </Routes>
  );
}

export default AppRouter;

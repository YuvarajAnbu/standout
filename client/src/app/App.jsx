import React, { useEffect, lazy, Suspense, useState } from "react";
import "@/app/App.scss";
import { BrowserRouter } from "react-router-dom";
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
import ErrorBoundary from "@/app/ErrorBoundary";
import { authQueryOptions } from "@/shared/api/queries";
import { useAppStore } from "@/app/store/useAppStore";
import { unlockPageScroll } from "@/shared/utils/pageScroll";
import AppRouter from "@/app/router";
const Header = lazy(() => import("@/app/layout/header/Header"));
const Footer = lazy(() => import("@/app/layout/footer/Footer"));

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
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    unlockPageScroll();
  }, []);

  useEffect(() => {
    if (authQuery.data) {
      setUser(authQuery.data.user || {});
      setAuthInitialized(true);
    } else if (authQuery.isError) {
      setUser({});
      setAuthInitialized(true);
    }
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
          {authQuery.isPending || !authInitialized ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <AppRouter />
          )}
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;

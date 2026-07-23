import { Navigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";

export default function AdminRoute({ children }) {
  const isAdmin = useAppStore((state) => state.user.type === "admin");
  return isAdmin ? children : <Navigate to="/404" replace />;
}

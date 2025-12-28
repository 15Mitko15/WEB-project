import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentUser } from "../contexts/current-user-context";

function NavigateToLogin() {
  const location = useLocation();
  return <Navigate to="/login" state={{ location: location.pathname }} />;
}

export function PrivateOutlet() {
  const user = useCurrentUser();

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : <NavigateToLogin />;
}

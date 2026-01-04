import { userInfoService } from "../services/user-info-service.js";
import { getCurrentUser } from "../contexts/current-user-context.js";

export function PrivateOutlet(rootEl, renderChild) {
  // check session lazily on navigation
  // Remove token check
  // const user = userInfoService.userInfoService.requireValidSession()v
  const user = userInfoService.initialUser;

  console.log("initial user", user);

  if (!user) {
    // clear stale data and redirect
    userInfoService.clear();
    window.location.hash = "#/login";
    return;
  }

  // user is authenticated → continue rendering
  renderChild();
}

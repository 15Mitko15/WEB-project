import { userInfoService } from "../services/user-info-service.js";
import { authService } from "../services/auth-service.js";

let inFlightMe = null;

export async function PrivateOutlet(rootEl, renderChild) {
  const cachedUser = userInfoService.currentUser;
  if (cachedUser) {
    renderChild();
  }

  try {
    if (!inFlightMe) {
      inFlightMe = authService.me();
    }
    const user = await inFlightMe;
    inFlightMe = null;

    if (!user) throw new Error("No user");

    if (!cachedUser) {
      renderChild();
    }
  } catch {
    inFlightMe = null;
    userInfoService.clear();
    window.location.hash = "#/login";
  }
}

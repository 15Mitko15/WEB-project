import { PrivateOutlet } from "./private-outlet.js";
import { userInfoService } from "../services/user-info-service.js";

function isTeacher(user) {
  return String(user?.role || "").toLowerCase() === "teacher";
}

export function TeacherOutlet(rootEl, renderFn) {
  return PrivateOutlet(rootEl, () => {
    const user = userInfoService.currentUser;

    console.log(user);

    if (!isTeacher(user)) {
      window.location.hash = "#/";
      return null;
    }

    return renderFn(user);
  });
}

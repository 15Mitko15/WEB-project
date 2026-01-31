import { PrivateOutlet } from "./private-outlet.js";
import { userInfoService } from "../services/user-info-service.js";

function isTeacher(user) {
  return user?.role_id ?? 0 === 2;
}

export function TeacherOutlet(rootEl, renderFn) {
  return PrivateOutlet(rootEl, () => {
    const user = userInfoService.currentUser;

    if (!isTeacher(user)) {
      window.location.hash = "#/";
      return null;
    }

    return renderFn(user);
  });
}

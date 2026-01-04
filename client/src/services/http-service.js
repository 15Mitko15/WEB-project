import {
  AuthError,
  BadRequestError,
  HTTPError,
  NotFoundError,
  ServerError,
  ValidationError,
} from "../errors.js";
import { authService } from "./auth-service.js";
import { userInfoService } from "./user-info-service.js";

// HARDCODING SOME BASE URL - need to get that info from the backend
const BASE_URL = "http://localhost:3001";

class HTTPService {
  get(path, options) {
    return this.request(path, "GET", options);
  }

  post(path, options) {
    return this.request(path, "POST", options);
  }

  put(path, options) {
    return this.request(path, "PUT", options);
  }

  delete(path, options) {
    return this.request(path, "DELETE", options);
  }

  async request(path, method, { query, headers, body } = {}) {
    const token = userInfoService.authToken;

    const baseUrl = BASE_URL.replace(/\/$/, "");
    const requestPath = String(path).replace(/^\//, "");
    const searchParams = query ? new URLSearchParams(query).toString() : "";

    const reqUrl = `${baseUrl}/${requestPath}${
      searchParams ? `?${searchParams}` : ""
    }`;

    let res;
    try {
      res = await fetch(reqUrl, {
        method,
        headers: {
          ...(token ? { Authorization: token } : {}),
          ...(body ? { "Content-Type": "application/json" } : {}),
          ...(headers || {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
    } catch {
      throw new HTTPError();
    }

    if (!res.ok) {
      if (res.status === 400) {
        const data = await res.json();
        if (
          data &&
          typeof data === "object" &&
          "fieldErrors" in data &&
          "formErrors" in data
        ) {
          throw new ValidationError(data.fieldErrors, data.formErrors);
        }
        throw new BadRequestError();
      }
      if (res.status === 401) {
        authService.logout();
        throw new AuthError();
      }
      if (res.status === 404) {
        throw new NotFoundError();
      }
      throw new ServerError();
    }

    const result = await res.json();
    return { result, headers: res.headers };
  }
}

export const http = new HTTPService();

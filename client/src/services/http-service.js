import {
  AuthError,
  BadRequestError,
  HTTPError,
  NotFoundError,
  ServerError,
  ValidationError,
} from "../errors.js";
import { userInfoService } from "./user-info-service.js";

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
        credentials: "include",
        headers: {
          ...(body ? { "Content-Type": "application/json" } : {}),
          ...(headers || {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
    } catch {
      throw new HTTPError();
    }

    // parse response safely
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson
      ? await res.json().catch(() => null)
      : await res.text().catch(() => "");

    if (!res.ok) {
      const serverMsg =
        data && typeof data === "object" && "error" in data
          ? data.error
          : undefined;

      if (res.status === 400) {
        if (
          data &&
          typeof data === "object" &&
          "fieldErrors" in data &&
          "formErrors" in data
        ) {
          throw new ValidationError(data.fieldErrors, data.formErrors);
        }
        throw new BadRequestError(serverMsg);
      }

      if (res.status === 401) {
        // session expired / not logged in
        userInfoService.clear?.();
        throw new AuthError(serverMsg);
      }

      if (res.status === 404) {
        throw new NotFoundError(serverMsg);
      }

      throw new ServerError(serverMsg);
    }

    return { result: data, headers: res.headers };
  }
}

export const http = new HTTPService();

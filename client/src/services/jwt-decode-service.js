// Need to check the functionality here. Not finished
function decodeJwtPart(part) {
  const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

  const json = atob(padded)
    .split("")
    .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");

  return JSON.parse(decodeURIComponent(json));
}

export function decodeJwt(token) {
  if (typeof token !== "string") throw new Error("JWT must be a string");
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT format");

  return {
    header: decodeJwtPart(parts[0]),
    payload: decodeJwtPart(parts[1]),
  };
}

export function decodeJwtPayload(token) {
  return decodeJwt(token).payload;
}

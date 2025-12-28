export class HTTPError extends Error {}
export class AuthError extends HTTPError {}
export class NotFoundError extends HTTPError {}
export class ServerError extends Error {}
export class BadRequestError extends HTTPError {}

// fieldErrors - object with a key (string) and value,
// formErrors - an array
export class ValidationError extends Error {
  constructor(fieldErrors, formErrors) {
    super();
  }
}
export class TerritoryNotFoundError extends Error {}
export class NoFreeTerritoryError extends Error {}

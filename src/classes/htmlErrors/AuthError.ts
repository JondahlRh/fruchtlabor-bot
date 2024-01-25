import HtmlError from "../HtmlError";

export default class AuthError extends HtmlError {
  constructor() {
    super("Api key is not valid!", 401);
  }
}

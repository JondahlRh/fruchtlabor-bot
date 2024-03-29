import HtmlResponse from "classes/HtmlResponse";

export default class AuthError extends HtmlResponse<null> {
  constructor() {
    super("Api key is not valid!", 401, null);
  }
}

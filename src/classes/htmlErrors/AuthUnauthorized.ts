import HtmlResponse from "classes/HtmlResponse";

export default class AuthUnauthorized extends HtmlResponse<null> {
  constructor() {
    super("Unauthorized!", 401, null);
  }
}

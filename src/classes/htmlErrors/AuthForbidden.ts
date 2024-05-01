import HtmlResponse from "classes/HtmlResponse";

export default class AuthForbidden extends HtmlResponse<null> {
  constructor() {
    super("Forbidden!", 403, null);
  }
}

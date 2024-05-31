import HtmlResponse from "classes/HtmlResponse";

export default class UnknownServerError extends HtmlResponse<null> {
  constructor() {
    super("An unknown server error occured!", 500, null);
  }
}

import HtmlResponse from "classes/HtmlResponse";

export default class UnknownDatabaseError extends HtmlResponse<null> {
  constructor() {
    super("An unknown database error occured!", 500, null);
  }
}

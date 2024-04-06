import HtmlResponse from "classes/HtmlResponse";

export default class UnknownRouteError extends HtmlResponse<null> {
  constructor() {
    super("Route does not exist!", 404, null);
  }
}

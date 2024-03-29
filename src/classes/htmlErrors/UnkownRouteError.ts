import HtmlResponse from "classes/HtmlResponse";

export default class UnkownRouteError extends HtmlResponse<null> {
  constructor() {
    super("Route does not exist!", 404, null);
  }
}

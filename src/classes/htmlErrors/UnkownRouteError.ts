import HtmlResponse from "../HtmlResponse";

export default class UnkownRouteError extends HtmlResponse<null> {
  constructor() {
    super("Route does not exist!", 404, null);
  }
}

import HtmlError from "../HtmlError";

export default class UnkownRouteError extends HtmlError {
  constructor() {
    super("Route does not exist!", 500);
  }
}

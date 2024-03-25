import HtmlResponse from "../HtmlResponse";

export default class SingleDataResponse<T> extends HtmlResponse<T> {
  constructor(single: T) {
    super("Single data", 200, single);
  }
}

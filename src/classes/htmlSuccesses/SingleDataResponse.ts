import HtmlResponse from "classes/HtmlResponse";

export default class SingleDataResponse<T> extends HtmlResponse<T> {
  constructor(single: T) {
    super("Single data", 200, single);
  }
}

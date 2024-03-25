import HtmlResponse from "../HtmlResponse";

export default class ListDataResponse<T> extends HtmlResponse<T[]> {
  constructor(list: T[]) {
    super("List data", 200, list);
  }
}

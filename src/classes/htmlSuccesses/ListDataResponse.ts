import HtmlResponse from "classes/HtmlResponse";

export default class ListDataResponse<T> extends HtmlResponse<T[]> {
  constructor(list: T[]) {
    super("List data", 200, list);
  }
}

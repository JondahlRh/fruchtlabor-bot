import HtmlResponse from "./HtmlResponse";

export default class DataResponse<T> extends HtmlResponse {
  data: T;

  constructor(message: string, data: T) {
    super(message);

    this.data = data;
  }
}

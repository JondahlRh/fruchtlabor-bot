import HtmlResponse from "classes/HtmlResponse";

export default class RequestBodyError extends HtmlResponse<string> {
  constructor(zoderror: string) {
    super("Request body invalid!", 400, zoderror);
  }
}

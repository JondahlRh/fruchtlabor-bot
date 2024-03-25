import HtmlResponse from "../HtmlResponse";

export default class RequestBodyError extends HtmlResponse<string> {
  constructor(zoderror: string) {
    super("Request body invalid!", 400, zoderror);
  }
}

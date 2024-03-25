import HtmlError from "../HtmlError";

export default class RequestBodyError extends HtmlError {
  zoderror: string;

  constructor(zoderror: string) {
    super("Request body invalid!", 400);
    this.zoderror = zoderror;
  }
}

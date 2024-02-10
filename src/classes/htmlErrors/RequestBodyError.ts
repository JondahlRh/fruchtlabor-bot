import HtmlError from "../HtmlError";

export default class RequestBodyError extends HtmlError {
  zoderror: string;

  constructor(zoderror: string) {
    super("RFequest body invalid!", 400);
    this.zoderror = zoderror;
  }
}

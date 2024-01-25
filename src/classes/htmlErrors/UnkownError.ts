import HtmlError from "../HtmlError";

export default class UnkownError extends HtmlError {
  constructor() {
    super("An unkown error occured!", 500);
  }
}

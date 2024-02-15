import HtmlError from "../HtmlError";

export default class UnkownDatabaseError extends HtmlError {
  constructor() {
    super("An unkown database error occured!", 500);
  }
}

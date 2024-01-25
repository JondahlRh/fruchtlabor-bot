import HtmlError from "../HtmlError";

export default class UnkownTeamspeakError extends HtmlError {
  constructor() {
    super("An unkown teamspeak error occured!", 500);
  }
}

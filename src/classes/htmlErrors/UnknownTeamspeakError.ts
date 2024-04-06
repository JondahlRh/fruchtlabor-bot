import HtmlResponse from "classes/HtmlResponse";

export default class UnknownTeamSpeakError extends HtmlResponse<null> {
  constructor() {
    super("An unknown teamspeak error occured!", 500, null);
  }
}

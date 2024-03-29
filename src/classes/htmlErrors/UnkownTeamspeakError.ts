import HtmlResponse from "classes/HtmlResponse";

export default class UnkownTeamSpeakError extends HtmlResponse<null> {
  constructor() {
    super("An unkown teamspeak error occured!", 500, null);
  }
}

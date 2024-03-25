import HtmlResponse from "../HtmlResponse";

export default class UnkownTeamSpeakError extends HtmlResponse<null> {
  constructor() {
    super("An unkown teamspeak error occured!", 500, null);
  }
}

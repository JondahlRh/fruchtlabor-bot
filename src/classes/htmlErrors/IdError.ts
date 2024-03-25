import HtmlResponse from "../HtmlResponse";

export default class IdError extends HtmlResponse<string> {
  constructor(id: string) {
    super("The id does not exist!", 400, id);
  }
}

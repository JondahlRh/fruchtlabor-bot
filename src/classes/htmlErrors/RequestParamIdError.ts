import HtmlResponse from "classes/HtmlResponse";

export default class RequestParamIdError extends HtmlResponse<null> {
  constructor() {
    super("No param id provided!", 400, null);
  }
}

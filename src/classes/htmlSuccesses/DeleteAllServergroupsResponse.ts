import HtmlResponse from "../HtmlResponse";

export default class DeleteAllServergroupsResponse extends HtmlResponse<null> {
  constructor() {
    super("All servergroups removed!", 200, null);
  }
}

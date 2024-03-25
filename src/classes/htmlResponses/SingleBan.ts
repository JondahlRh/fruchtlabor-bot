import HtmlResponse from "../HtmlResponse";

export default class SingleBan extends HtmlResponse<MappedBan> {
  constructor(mappedBan: MappedBan) {
    super("Single Ban", mappedBan);
  }
}

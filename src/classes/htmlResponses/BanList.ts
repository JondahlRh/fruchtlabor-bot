import HtmlResponse from "../HtmlResponse";

export default class BanList extends HtmlResponse<MappedBan[]> {
  constructor(mappedBans: MappedBan[]) {
    super("List of Bans", mappedBans);
  }
}

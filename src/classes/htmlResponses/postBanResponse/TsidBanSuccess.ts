import HtmlResponse from "../../HtmlResponse";

export default class TsidBanSuccess extends HtmlResponse {
  success: boolean;
  banid: string;

  constructor(banid: string) {
    super("Tsid ban successful!");

    this.success = true;
    this.banid = banid;
  }
}

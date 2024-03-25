import HtmlResponse from "../../HtmlResponse";

export default class IpBanSuccess extends HtmlResponse {
  success: boolean;
  banid: string;

  constructor(banid: string) {
    super("Ip ban successful!");

    this.success = true;
    this.banid = banid;
  }
}

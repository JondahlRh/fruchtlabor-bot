import HtmlResponse from "../../HtmlResponse";

export default class TsidBanSuccess {
  success: boolean;
  banid: string;

  constructor(banid: string) {
    this.success = true;
    this.banid = banid;
  }
}

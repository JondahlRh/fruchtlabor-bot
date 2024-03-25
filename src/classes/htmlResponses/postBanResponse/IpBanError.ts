import HtmlError from "../../HtmlError";

export default class IpBanError extends HtmlError {
  success: boolean;

  constructor() {
    super("Ip ban failed!", 500);

    this.success = false;
  }
}

import HtmlError from "../../HtmlError";

export default class TsidBanError extends HtmlError {
  success: boolean;

  constructor() {
    super("Tsid ban failed!", 500);

    this.success = false;
  }
}

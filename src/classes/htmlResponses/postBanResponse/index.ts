import HtmlResponse from "../../HtmlResponse";
import IpBanError from "./IpBanError";
import IpBanSuccess from "./IpBanSuccess";
import TsidBanError from "./TsidBanError";
import TsidBanSuccess from "./TsidBanSuccess";

class PostBanData {
  ipBan: IpBanError | IpBanSuccess;
  tsidBan: TsidBanError | TsidBanSuccess;

  constructor(ipBanId: string | null, tsidBanId: string | null) {
    this.ipBan = ipBanId ? new IpBanSuccess(ipBanId) : new IpBanError();
    this.tsidBan = tsidBanId
      ? new TsidBanSuccess(tsidBanId)
      : new TsidBanError();
  }
}

export default class PostBanResponse extends HtmlResponse<PostBanData> {
  constructor(ipBanId: string | null, tsidBanId: string | null) {
    super("Ban initalizied", new PostBanData(ipBanId, tsidBanId));
  }
}

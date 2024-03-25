import HtmlResponse from "../../HtmlResponse";
import IdSuccess from "../general/IdSuccess";
import IpBanError from "./IpBanError";
import TsidBanError from "./TsidBanError";

class PostBanData {
  ipBan: IpBanError | IdSuccess;
  tsidBan: TsidBanError | IdSuccess;

  constructor(ipBanId: string | null, tsidBanId: string | null) {
    this.ipBan = ipBanId ? new IdSuccess(ipBanId) : new IpBanError();
    this.tsidBan = tsidBanId ? new IdSuccess(tsidBanId) : new TsidBanError();
  }
}

export default class PostBanResponse extends HtmlResponse<PostBanData> {
  constructor(ipBanId: string | null, tsidBanId: string | null) {
    const statusCode = ipBanId || tsidBanId ? 201 : 200;

    super(
      "Post ban initalizied",
      new PostBanData(ipBanId, tsidBanId),
      statusCode
    );
  }
}

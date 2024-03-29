import HtmlResponse from "classes/HtmlResponse";

class PostBanData {
  ipBanId: string | null;
  tsidBanId: string | null;

  constructor(ipBanId: string | null, tsidBanId: string | null) {
    this.ipBanId = ipBanId;
    this.tsidBanId = tsidBanId;
  }
}

export default class PostBanResponse extends HtmlResponse<PostBanData> {
  constructor(ipBanId: string | null, tsidBanId: string | null) {
    super("Client bann added!", 201, new PostBanData(ipBanId, tsidBanId));
  }
}

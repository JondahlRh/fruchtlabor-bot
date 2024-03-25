import HtmlResponse from "../HtmlResponse";

class PostBanData {
  ipBanSuccesful: boolean;
  tsidBanSuccesful: boolean;

  constructor(ipBanId: string | null, tsidBanId: string | null) {
    this.ipBanSuccesful = ipBanId !== null;
    this.tsidBanSuccesful = tsidBanId !== null;
  }
}

export default class PostBanResponse extends HtmlResponse<PostBanData> {
  constructor(ipBanId: string | null, tsidBanId: string | null) {
    super("Client bann added!", 201, new PostBanData(ipBanId, tsidBanId));
  }
}

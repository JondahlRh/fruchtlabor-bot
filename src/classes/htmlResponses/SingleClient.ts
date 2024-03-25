import HtmlResponse from "../HtmlResponse";

export default class SingleClient extends HtmlResponse<MappedClient> {
  constructor(mappedClient: MappedClient) {
    super("Single Client", mappedClient);
  }
}

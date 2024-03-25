import HtmlResponse from "../HtmlResponse";

export default class SingleChannel extends HtmlResponse<MappedChannel> {
  constructor(mappedChannel: MappedChannel) {
    super("Single Channel", mappedChannel);
  }
}

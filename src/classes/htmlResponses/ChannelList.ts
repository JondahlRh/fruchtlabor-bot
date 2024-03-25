import HtmlResponse from "../HtmlResponse";

export default class ChannelList extends HtmlResponse<MappedChannel[]> {
  constructor(mappedChannels: MappedChannel[]) {
    super("List of Channels", mappedChannels);
  }
}

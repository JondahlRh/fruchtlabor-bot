import DataResponse from "../DataResponse";

export default class ChannelList extends DataResponse<MappedChannel[]> {
  constructor(mappedChannels: MappedChannel[]) {
    super("List of Channels", mappedChannels);
  }
}

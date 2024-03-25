import DataResponse from "../DataResponse";

export default class SingleChannel extends DataResponse<MappedChannel> {
  constructor(mappedChannel: MappedChannel) {
    super("Single Channel", mappedChannel);
  }
}

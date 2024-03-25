import DataResponse from "../DataResponse";

export default class SingleBan extends DataResponse<MappedBan> {
  constructor(mappedBan: MappedBan) {
    super("Single Ban", mappedBan);
  }
}

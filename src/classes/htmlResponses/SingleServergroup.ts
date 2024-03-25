import DataResponse from "../DataResponse";

export default class SingleServergroup extends DataResponse<MappedServerGroup> {
  constructor(mappedServergroup: MappedServerGroup) {
    super("Single Servergroup", mappedServergroup);
  }
}

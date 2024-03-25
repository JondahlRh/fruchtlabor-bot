import DataResponse from "../DataResponse";

export default class ServergroupList extends DataResponse<MappedServerGroup[]> {
  constructor(mappedServergroups: MappedServerGroup[]) {
    super("List of Clients", mappedServergroups);
  }
}

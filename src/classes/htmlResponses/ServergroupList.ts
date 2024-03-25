import HtmlResponse from "../HtmlResponse";

export default class ServergroupList extends HtmlResponse<MappedServerGroup[]> {
  constructor(mappedServergroups: MappedServerGroup[]) {
    super("List of Clients", mappedServergroups);
  }
}

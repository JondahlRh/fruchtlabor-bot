import HtmlResponse from "../HtmlResponse";

export default class SingleServergroup extends HtmlResponse<MappedServerGroup> {
  constructor(mappedServergroup: MappedServerGroup) {
    super("Single Servergroup", mappedServergroup);
  }
}

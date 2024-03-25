import DataResponse from "../DataResponse";

export default class SingleClient extends DataResponse<MappedClient> {
  constructor(mappedClient: MappedClient) {
    super("Single Client", mappedClient);
  }
}

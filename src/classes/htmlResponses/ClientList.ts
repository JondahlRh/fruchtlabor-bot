import DataResponse from "../DataResponse";

export default class ClientList extends DataResponse<MappedClient[]> {
  constructor(mappedClients: MappedClient[]) {
    super("List of Clients", mappedClients);
  }
}

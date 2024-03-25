import HtmlResponse from "../HtmlResponse";

export default class ClientList extends HtmlResponse<MappedClient[]> {
  constructor(mappedClients: MappedClient[]) {
    super("List of Clients", mappedClients);
  }
}

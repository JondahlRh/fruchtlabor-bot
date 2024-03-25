import DataResponse from "../DataResponse";

export default class BanList extends DataResponse<MappedBan[]> {
  constructor(mappedBans: MappedBan[]) {
    super("List of Bans", mappedBans);
  }
}

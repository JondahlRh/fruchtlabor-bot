import HtmlResponse from "../../HtmlResponse";
import IdDoesNotExistError from "../general/IdDoesNotExistError";
import IdSuccess from "../general/IdSuccess";
import UnkownError from "../general/UnkownError";

export type DeletedBanStatus = IdDoesNotExistError | IdSuccess | UnkownError;

export default class DeleteBanResponse extends HtmlResponse<
  DeletedBanStatus[]
> {
  constructor(deletedBans: DeletedBanStatus[]) {
    super("Delete bans initalizied", deletedBans);
  }
}

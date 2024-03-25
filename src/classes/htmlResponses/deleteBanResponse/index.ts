import HtmlResponse from "../../HtmlResponse";
import DeleteBanIdError from "./DeleteBanIdError";
import DeleteBanSuccess from "./DeleteBanSuccess";
import DeleteBanUnkownError from "./DeleteBanUnkownError";

export type DeletedBanStatus =
  | DeleteBanIdError
  | DeleteBanUnkownError
  | DeleteBanSuccess;

export default class DeleteBanResponse extends HtmlResponse<
  DeletedBanStatus[]
> {
  constructor(deletedBans: DeletedBanStatus[]) {
    super("Delete bans initalizied", deletedBans);
  }
}

export { DeleteBanIdError, DeleteBanSuccess, DeleteBanUnkownError };

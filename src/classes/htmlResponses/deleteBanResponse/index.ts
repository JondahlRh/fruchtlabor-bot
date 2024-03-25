import HtmlResponse from "../../HtmlResponse";
import DeleteBanBanidError from "./DeleteBanBanidError";
import DeleteBanSuccess from "./DeleteBanSuccess";
import DeleteBanUnkownError from "./DeleteBanUnkownError";

export type DeletedBanStatus =
  | DeleteBanBanidError
  | DeleteBanUnkownError
  | DeleteBanSuccess;

export default class DeleteBanResponse extends HtmlResponse<
  DeletedBanStatus[]
> {
  constructor(deletedBans: DeletedBanStatus[]) {
    super("Delete bans initalizied", deletedBans);
  }
}

export { DeleteBanBanidError, DeleteBanSuccess, DeleteBanUnkownError };

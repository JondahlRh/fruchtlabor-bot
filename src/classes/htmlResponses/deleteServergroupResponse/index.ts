import HtmlResponse from "../../HtmlResponse";
import IdDoesNotExistError from "../general/IdDoesNotExistError";
import IdSuccess from "../general/IdSuccess";
import UnkownError from "../general/UnkownError";
import DeleteServergroupEmptyError from "./DeleteServergroupEmptyError";

export type DeleteServergroupStatus =
  | IdDoesNotExistError
  | IdSuccess
  | UnkownError
  | DeleteServergroupEmptyError;

export default class DeleteServergroupResponse extends HtmlResponse<
  DeleteServergroupStatus[]
> {
  constructor(deletedServergroups: DeleteServergroupStatus[]) {
    super("Delete servergroups initalizied", deletedServergroups);
  }
}

export { DeleteServergroupEmptyError };

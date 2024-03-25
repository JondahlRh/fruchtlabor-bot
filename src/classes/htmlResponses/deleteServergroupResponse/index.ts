import HtmlResponse from "../../HtmlResponse";
import DeleteServergroupEmptyError from "./DeleteServergroupEmptyError";
import DeleteServergroupIdError from "./DeleteServergroupIdError";
import DeleteServergroupSuccess from "./DeleteServergroupSuccess";
import DeleteServergroupUnkownError from "./DeleteServergroupUnkownError";

export type DeleteServergroupStatus =
  | DeleteServergroupEmptyError
  | DeleteServergroupIdError
  | DeleteServergroupUnkownError
  | DeleteServergroupSuccess;

export default class DeleteServergroupResponse extends HtmlResponse<
  DeleteServergroupStatus[]
> {
  constructor(deletedServergroups: DeleteServergroupStatus[]) {
    super("Delete servergroups initalizied", deletedServergroups);
  }
}

export {
  DeleteServergroupEmptyError,
  DeleteServergroupIdError,
  DeleteServergroupUnkownError,
  DeleteServergroupSuccess,
};

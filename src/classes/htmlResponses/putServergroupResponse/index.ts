import HtmlResponse from "../../HtmlResponse";
import IdDoesNotExistError from "../general/IdDoesNotExistError";
import IdSuccess from "../general/IdSuccess";
import UnkownError from "../general/UnkownError";
import PutServergroupDuplicateError from "./PutServergroupDuplicateError";

export type PutServergroupStatus =
  | IdDoesNotExistError
  | IdSuccess
  | UnkownError
  | PutServergroupDuplicateError;

export default class PutServergroupResponse extends HtmlResponse<
  PutServergroupStatus[]
> {
  constructor(puttedServergroups: PutServergroupStatus[]) {
    super("Put servergroups initalizied", puttedServergroups);
  }
}

export { PutServergroupDuplicateError };

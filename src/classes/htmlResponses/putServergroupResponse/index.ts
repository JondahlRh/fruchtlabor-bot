import HtmlResponse from "../../HtmlResponse";
import PutServergroupDuplicateError from "./PutServergroupDuplicateError";
import PutServergroupIdError from "./PutServergroupIdError";
import PutServergroupUnkownError from "./PutServergroupUnkownError";

export type PutServergroupStatus =
  | PutServergroupIdError
  | PutServergroupDuplicateError
  | PutServergroupUnkownError;

export default class PutServergroupResponse extends HtmlResponse<
  PutServergroupStatus[]
> {
  constructor(puttedServergroups: PutServergroupStatus[]) {
    super("Put servergroups initalizied", puttedServergroups);
  }
}

export {
  PutServergroupIdError,
  PutServergroupDuplicateError,
  PutServergroupUnkownError,
};

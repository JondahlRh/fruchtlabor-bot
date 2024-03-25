import HtmlResponse from "../HtmlResponse";
import PartialDuplicateError from "./PartialDuplicateError";
import PartialEmptyError from "./PartialEmptyError";
import PartialError from "./PartialError";
import PartialIdError from "./PartialIdError";
import PartialSuccess from "./PartialSuccess";
import PartialUnkownTeamspeakError from "./PartialUnkownTeamspeakError";

export type PartialResponse = PartialError | PartialSuccess;

export default class PartialSuccessResponse extends HtmlResponse<
  PartialResponse[]
> {
  constructor(partialResponses: PartialResponse[]) {
    super("PartialSuccessResponse", 200, partialResponses);
  }
}

export {
  PartialDuplicateError,
  PartialEmptyError,
  PartialIdError,
  PartialUnkownTeamspeakError,
};

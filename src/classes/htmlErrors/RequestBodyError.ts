import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

import HtmlResponse from "classes/HtmlResponse";

export default class RequestBodyError extends HtmlResponse<string> {
  constructor(zoderror: ZodError) {
    super("Request body invalid!", 400, fromZodError(zoderror).toString());
  }
}

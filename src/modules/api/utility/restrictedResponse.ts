import { Response } from "express";

import HtmlResponse from "../../../classes/HtmlResponse";

const restrictedResponse = <T>(res: Response, response: HtmlResponse<T>) => {
  res.json(response);
};

export default restrictedResponse;

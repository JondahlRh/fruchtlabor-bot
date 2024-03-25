import { Response } from "express";

import HtmlResponse from "../../../classes/HtmlResponse";

const restrictedResponse = <T>(res: Response, error: HtmlResponse<T>) => {
  res.json(error);
};

export default restrictedResponse;

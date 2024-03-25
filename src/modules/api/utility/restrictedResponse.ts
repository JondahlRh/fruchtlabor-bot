import { Response } from "express";

import HtmlResponse from "../../../classes/HtmlResponse";

const restrictedResponse = (res: Response, error: HtmlResponse) => {
  res.json(error);
};

export default restrictedResponse;

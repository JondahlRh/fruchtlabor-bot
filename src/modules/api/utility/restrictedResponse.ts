import HtmlResponse from "classes/HtmlResponse";
import { Response } from "express";

const restrictedResponse = <T>(res: Response, response: HtmlResponse<T>) => {
  res.status(response.status).json(response);
};

export default restrictedResponse;

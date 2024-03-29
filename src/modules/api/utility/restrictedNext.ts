import { NextFunction } from "express";

import HtmlResponse from "classes/HtmlResponse";

const restrictedNext = <T>(next: NextFunction, error: HtmlResponse<T>) => {
  next(error);
};

export default restrictedNext;

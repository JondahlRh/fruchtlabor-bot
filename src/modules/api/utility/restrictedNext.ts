import HtmlResponse from "classes/HtmlResponse";
import { NextFunction } from "express";

const restrictedNext = <T>(next: NextFunction, error: HtmlResponse<T>) => {
  next(error);
};

export default restrictedNext;

import { NextFunction } from "express";

const restrictedNext = (next: NextFunction, error: HtmlError) => {
  next(error);
};

export default restrictedNext;

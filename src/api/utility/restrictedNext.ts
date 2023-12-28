import { NextFunction } from "express";

import { HtmlError } from "../types/errors";

const restrictedNext = (next: NextFunction, error: HtmlError) => {
  next(error);
};

export default restrictedNext;

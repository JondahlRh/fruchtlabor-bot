import { NextFunction } from "express";

import HtmlError from "../../../classes/HtmlError";

const restrictedNext = (next: NextFunction, error: HtmlError) => {
  next(error);
};

export default restrictedNext;

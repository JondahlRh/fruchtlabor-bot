import { ErrorRequestHandler, RequestHandler } from "express";

import HtmlError from "../../../classes/HtmlError";
import UnkownRouteError from "../../../classes/htmlErrors/UnkownRouteError";
import restrictedNext from "../utility/restrictedNext";

const unkownRouteError: RequestHandler = (req, res, next) => {
  restrictedNext(next, new UnkownRouteError());
};

const errorRoute: ErrorRequestHandler = (error: HtmlError, req, res, next) => {
  if (res.headersSent) restrictedNext(next, error);

  res.status(error.statuscode).json(error);
};

export { unkownRouteError, errorRoute };

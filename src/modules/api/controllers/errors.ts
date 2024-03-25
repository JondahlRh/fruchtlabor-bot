import { ErrorRequestHandler, RequestHandler } from "express";

import HtmlResponse from "../../../classes/HtmlResponse";
import UnkownRouteError from "../../../classes/htmlErrors/UnkownRouteError";
import restrictedNext from "../utility/restrictedNext";

type Err = HtmlResponse<any>;

const unkownRouteError: RequestHandler = (req, res, next) => {
  restrictedNext(next, new UnkownRouteError());
};

const errorRoute: ErrorRequestHandler = (error: Err, req, res, next) => {
  if (res.headersSent) return restrictedNext(next, error);

  res.status(error.status).json(error);
};

export { unkownRouteError, errorRoute };

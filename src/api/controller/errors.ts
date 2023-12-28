import { ErrorRequestHandler, RequestHandler } from "express";

import { getHtmlResponse, getHtmlStatusCode } from "../utility/htmlErrorData";
import restrictedNext from "../utility/restrictedNext";

const unkownRouteError: RequestHandler = (req, res, next) => {
  const error: UnkownError = { errorCode: ApiErrorCodes.UNKOWN_ROUTE };
  restrictedNext(next, error);
};

const errorRoute: ErrorRequestHandler = (error: HtmlError, req, res, next) => {
  if (res.headersSent) restrictedNext(next, error);

  const statusCode = getHtmlStatusCode(error.errorCode);
  res.status(statusCode);

  const response = getHtmlResponse(error);
  res.json(response);
};

export { unkownRouteError, errorRoute };

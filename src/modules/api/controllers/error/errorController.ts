import { ErrorRequestHandler } from "express";

import restrictedNext from "modules/api/utility/restrictedNext";

const errorController: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) return restrictedNext(next, error);

  res.status(error.status).json(error);
};

export default errorController;

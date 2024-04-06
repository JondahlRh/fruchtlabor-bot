import { RequestHandler } from "express";

import UnknownRouteError from "classes/htmlErrors/UnknownRouteError";

import restrictedNext from "modules/api/utility/restrictedNext";

const unknownRouteController: RequestHandler = (req, res, next) => {
  restrictedNext(next, new UnknownRouteError());
};

export default unknownRouteController;

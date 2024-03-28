import { RequestHandler } from "express";

import UnkownRouteError from "../../../../classes/htmlErrors/UnkownRouteError";
import restrictedNext from "../../utility/restrictedNext";

const unkownRouteController: RequestHandler = (req, res, next) => {
  restrictedNext(next, new UnkownRouteError());
};

export default unkownRouteController;

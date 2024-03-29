import UnkownRouteError from "classes/htmlErrors/UnkownRouteError";
import { RequestHandler } from "express";
import restrictedNext from "modules/api/utility/restrictedNext";

const unkownRouteController: RequestHandler = (req, res, next) => {
  restrictedNext(next, new UnkownRouteError());
};

export default unkownRouteController;

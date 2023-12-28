import { RequestHandler } from "express";

import restrictedNext from "../utility/restrictedNext";

const checkApikey: RequestHandler = (req, res, next) => {
  const apikey = req.headers.authorization?.split(" ")[1];

  if (!apikey || apikey !== process.env.API_KEY) {
    return restrictedNext(next, { errorCode: ApiErrorCodes.AUTH_ERROR });
  }

  next();
};

export default checkApikey;

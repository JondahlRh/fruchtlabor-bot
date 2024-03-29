import { RequestHandler } from "express";

import { AuthError } from "classes/htmlErrors";

import restrictedNext from "modules/api/utility/restrictedNext";

const checkApikey: RequestHandler = (req, res, next) => {
  const apikey = req.headers.authorization?.split(" ")[1];

  if (!apikey || apikey !== process.env.API_KEY) {
    return restrictedNext(next, new AuthError());
  }

  next();
};

export default checkApikey;

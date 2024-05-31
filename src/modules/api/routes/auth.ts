import { Router } from "express";

import auth from "../controllers/auth";
import authCheck from "../middlewares/authCheck";

export default () => {
  const route = Router();

  route.get("/generatetoken", authCheck(), auth().generateToken);

  return route;
};

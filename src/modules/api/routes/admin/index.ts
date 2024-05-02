import { Router } from "express";

import auth from "./auth";
import func from "./func";
import general from "./general";
import teamspeak from "./teamspeak";

export default () => {
  const route = Router();

  route.use("/auth", auth());
  route.use("/function", func());
  route.use("/general", general());
  route.use("/teamspeak", teamspeak());

  return route;
};

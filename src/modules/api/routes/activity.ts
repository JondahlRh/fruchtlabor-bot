import { Router } from "express";

import activity from "../controllers/activity";

export default () => {
  const route = Router();

  route.get("/", activity().getActivityList);
  route.get("/:id", activity().getActivityById);

  return route;
};

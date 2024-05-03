import { Router } from "express";

import ActivityEntry, {
  ActivityEntryZodSchema,
} from "models/general/ActivityEntry";
import ActivityEntryD, {
  ActivityEntryDZodSchema,
} from "models/general/ActivityEntryD";
import AsyncError, { AsyncErrorZodSchema } from "models/general/AsyncError";
import CsServer, { CsServerZodSchema } from "models/general/CsServer";
import Fruit, { FruitZodSchema } from "models/general/Fruit";
import SupportLog, { SupportLogZodSchema } from "models/general/SupportLog";

import adminRouteBuilder from "./adminRouteBuilder";

export default () => {
  const route = Router();

  route.use(
    "/activityEntry",
    adminRouteBuilder(ActivityEntry, ActivityEntryZodSchema)
  );
  route.use(
    "/activityEntryD",
    adminRouteBuilder(ActivityEntryD, ActivityEntryDZodSchema)
  );
  route.use("/asyncError", adminRouteBuilder(AsyncError, AsyncErrorZodSchema));
  route.use("/csServer", adminRouteBuilder(CsServer, CsServerZodSchema));
  route.use("/fruit", adminRouteBuilder(Fruit, FruitZodSchema));
  route.use("/supportLog", adminRouteBuilder(SupportLog, SupportLogZodSchema));

  return route;
};

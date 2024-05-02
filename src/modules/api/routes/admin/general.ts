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
    adminRouteBuilder("activityEntry", ActivityEntry, ActivityEntryZodSchema)
  );
  route.use(
    adminRouteBuilder("activityEntryD", ActivityEntryD, ActivityEntryDZodSchema)
  );
  route.use(adminRouteBuilder("asyncError", AsyncError, AsyncErrorZodSchema));
  route.use(adminRouteBuilder("csServer", CsServer, CsServerZodSchema));
  route.use(adminRouteBuilder("fruit", Fruit, FruitZodSchema));
  route.use(adminRouteBuilder("supportLog", SupportLog, SupportLogZodSchema));

  return route;
};

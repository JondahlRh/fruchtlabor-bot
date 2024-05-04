import { Router } from "express";

import ActivityEntry from "models/general/ActivityEntry";
import AsyncError from "models/general/AsyncError";
import CsServer from "models/general/CsServer";
import Fruit from "models/general/Fruit";
import SupportLog from "models/general/SupportLog";

import authCheck from "modules/api/middlewares/authCheck";

import {
  findActivityEntries,
  findActivityEntryById,
} from "services/mongodbServices/general/activityEntry";
import {
  findAsyncErrorById,
  findAsyncErrors,
} from "services/mongodbServices/general/asyncError";
import {
  findCsServerById,
  findCsServers,
} from "services/mongodbServices/general/csServer";
import {
  findFruitById,
  findFruits,
} from "services/mongodbServices/general/fruit";
import {
  findSupportLogById,
  findSupportLogs,
} from "services/mongodbServices/general/supportLog";

import adminRouteBuilder from "./adminRouteBuilder";

export default () => {
  const route = Router();

  route.use(
    "/activityentry",
    authCheck("manage_activityentry"),
    adminRouteBuilder(ActivityEntry, findActivityEntries, findActivityEntryById)
  );
  route.use(
    "/asyncerror",
    authCheck("manage_asyncerror"),
    adminRouteBuilder(AsyncError, findAsyncErrors, findAsyncErrorById)
  );
  route.use(
    "/csserver",
    authCheck("manage_csserver"),
    adminRouteBuilder(CsServer, findCsServers, findCsServerById)
  );
  route.use(
    "/fruit",
    authCheck("manage_fruit"),
    adminRouteBuilder(Fruit, findFruits, findFruitById)
  );
  route.use(
    "/supportlog",
    authCheck("manage_supportlog"),
    adminRouteBuilder(SupportLog, findSupportLogs, findSupportLogById)
  );

  return route;
};

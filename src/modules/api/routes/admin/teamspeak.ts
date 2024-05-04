import { Router } from "express";

import TsChannel from "models/teamspeak/TsChannel";
import TsChannelgroup from "models/teamspeak/TsChannelgroup";
import TsCollection from "models/teamspeak/TsCollection";
import TsDescription from "models/teamspeak/TsDescription";
import TsServergroup from "models/teamspeak/TsServergroup";

import {
  findTsChannelById,
  findTsChannels,
} from "services/mongodbServices/teamspeak/tsChannel";
import {
  findTsChannelgroupById,
  findTsChannelgroups,
} from "services/mongodbServices/teamspeak/tsChannelgroup";
import {
  findTsCollectionById,
  findTsCollections,
} from "services/mongodbServices/teamspeak/tsCollection";
import {
  findTsDescriptionById,
  findTsDescriptions,
} from "services/mongodbServices/teamspeak/tsDescription";
import {
  findTsServergroupById,
  findTsServergroups,
} from "services/mongodbServices/teamspeak/tsServergroup";

import adminRouteBuilder from "./adminRouteBuilder";

export default () => {
  const route = Router();

  route.use(
    "/tschannel",
    adminRouteBuilder(TsChannel, findTsChannels, findTsChannelById)
  );
  route.use(
    "/tschannelgroup",
    adminRouteBuilder(
      TsChannelgroup,
      findTsChannelgroups,
      findTsChannelgroupById
    )
  );
  route.use(
    "/tscollection",
    adminRouteBuilder(TsCollection, findTsCollections, findTsCollectionById)
  );
  route.use(
    "/tsdescription",
    adminRouteBuilder(TsDescription, findTsDescriptions, findTsDescriptionById)
  );
  route.use(
    "/tsservergroup",
    adminRouteBuilder(TsServergroup, findTsServergroups, findTsServergroupById)
  );

  return route;
};

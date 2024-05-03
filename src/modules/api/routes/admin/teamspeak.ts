import { Router } from "express";

import TsChannel, { TsChannelZodSchema } from "models/teamspeak/TsChannel";
import TsChannelgroup, {
  TsChannelgroupZodSchema,
} from "models/teamspeak/TsChannelgroup";
import TsCollection, {
  TsCollectionZodSchema,
} from "models/teamspeak/TsCollection";
import TsDescription, {
  TsDescriptionZodSchema,
} from "models/teamspeak/TsDescription";
import TsServergroup, {
  TsServergroupZodSchema,
} from "models/teamspeak/TsServergroup";

import adminRouteBuilder from "./adminRouteBuilder";

export default () => {
  const route = Router();

  route.use("/channel", adminRouteBuilder(TsChannel, TsChannelZodSchema));
  route.use(
    "/channelgroup",
    adminRouteBuilder(TsChannelgroup, TsChannelgroupZodSchema)
  );
  route.use(
    "/collection",
    adminRouteBuilder(TsCollection, TsCollectionZodSchema)
  );
  route.use(
    "/description",
    adminRouteBuilder(TsDescription, TsDescriptionZodSchema)
  );
  route.use(
    "/servergroup",
    adminRouteBuilder(TsServergroup, TsServergroupZodSchema)
  );

  return route;
};

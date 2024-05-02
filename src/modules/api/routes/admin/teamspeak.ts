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

  route.use(adminRouteBuilder("channel", TsChannel, TsChannelZodSchema));
  route.use(
    adminRouteBuilder("channelgroup", TsChannelgroup, TsChannelgroupZodSchema)
  );
  route.use(
    adminRouteBuilder("collection", TsCollection, TsCollectionZodSchema)
  );
  route.use(
    adminRouteBuilder("description", TsDescription, TsDescriptionZodSchema)
  );
  route.use(
    adminRouteBuilder("servergroup", TsServergroup, TsServergroupZodSchema)
  );

  return route;
};

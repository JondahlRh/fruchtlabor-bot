import { Router } from "express";

import AddgroupChannel, {
  AddgroupChannelZodSchema,
} from "models/functions/AddgroupChannel";
import AfkChannel, { AfkChannelZodSchema } from "models/functions/AfkChannel";
import CustomChannel, {
  CustomChannelZodSchema,
} from "models/functions/CustomChannel";
import JoinMessage, {
  JoinMessageZodSchema,
} from "models/functions/JoinMessage";
import LobbyChannel, {
  LobbyChannelZodSchema,
} from "models/functions/LobbyChannel";
import OnlineChannel, {
  OnlineChannelZodSchema,
} from "models/functions/OnlineChannel";
import ServerOverview, {
  ServerOverviewZodSchema,
} from "models/functions/ServerOverview";
import ServerPlayercount, {
  ServerPlayercountZodSchema,
} from "models/functions/ServerPlayercount";
import SupportMessage, {
  SupportMessageZodSchema,
} from "models/functions/SupportMessage";

import adminRouteBuilder from "./adminRouteBuilder";

export default () => {
  const route = Router();

  route.use(
    adminRouteBuilder(
      "addgroupChannel",
      AddgroupChannel,
      AddgroupChannelZodSchema
    )
  );
  route.use(adminRouteBuilder("afkChannel", AfkChannel, AfkChannelZodSchema));
  route.use(
    adminRouteBuilder("customChannel", CustomChannel, CustomChannelZodSchema)
  );
  route.use(
    adminRouteBuilder("joinMessage", JoinMessage, JoinMessageZodSchema)
  );
  route.use(
    adminRouteBuilder("lobbyChannel", LobbyChannel, LobbyChannelZodSchema)
  );
  route.use(
    adminRouteBuilder("onlineChannel", OnlineChannel, OnlineChannelZodSchema)
  );
  route.use(
    adminRouteBuilder("serverOverview", ServerOverview, ServerOverviewZodSchema)
  );
  route.use(
    adminRouteBuilder(
      "serverPlayercount",
      ServerPlayercount,
      ServerPlayercountZodSchema
    )
  );
  route.use(
    adminRouteBuilder("supportMessage", SupportMessage, SupportMessageZodSchema)
  );

  return route;
};

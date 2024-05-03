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
    "/addgroupChannel",
    adminRouteBuilder(AddgroupChannel, AddgroupChannelZodSchema)
  );
  route.use("/afkChannel", adminRouteBuilder(AfkChannel, AfkChannelZodSchema));
  route.use(
    "/customChannel",
    adminRouteBuilder(CustomChannel, CustomChannelZodSchema)
  );
  route.use(
    "/joinMessage",
    adminRouteBuilder(JoinMessage, JoinMessageZodSchema)
  );
  route.use(
    "/lobbyChannel",
    adminRouteBuilder(LobbyChannel, LobbyChannelZodSchema)
  );
  route.use(
    "/onlineChannel",
    adminRouteBuilder(OnlineChannel, OnlineChannelZodSchema)
  );
  route.use(
    "/serverOverview",
    adminRouteBuilder(ServerOverview, ServerOverviewZodSchema)
  );
  route.use(
    "/serverPlayercount",
    adminRouteBuilder(ServerPlayercount, ServerPlayercountZodSchema)
  );
  route.use(
    "/supportMessage",
    adminRouteBuilder(SupportMessage, SupportMessageZodSchema)
  );

  return route;
};

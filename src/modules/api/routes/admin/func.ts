import { Router } from "express";

import AddgroupChannel from "models/functions/AddgroupChannel";
import AfkChannel from "models/functions/AfkChannel";
import CustomChannel from "models/functions/CustomChannel";
import JoinMessage from "models/functions/JoinMessage";
import LobbyChannel from "models/functions/LobbyChannel";
import OnlineChannel from "models/functions/OnlineChannel";
import ServerOverview from "models/functions/ServerOverview";
import ServerPlayercount from "models/functions/ServerPlayercount";
import SupportMessage from "models/functions/SupportMessage";

import {
  findAddgroupChannelById,
  findAddgroupChannels,
} from "services/mongodbServices/functions/addgroupChannel";
import {
  findAfkChannelById,
  findAfkChannels,
} from "services/mongodbServices/functions/afkChannel";
import {
  findCustomChannelById,
  findCustomChannels,
} from "services/mongodbServices/functions/customChannel";
import {
  findJoinMessageById,
  findJoinMessages,
} from "services/mongodbServices/functions/joinMessage";
import {
  findLobbyChannelById,
  findLobbyChannels,
} from "services/mongodbServices/functions/lobbyChannel";
import {
  findOnlineChannelById,
  findOnlineChannels,
} from "services/mongodbServices/functions/onlineChannel";
import {
  findServerOverviewById,
  findServerOverviews,
} from "services/mongodbServices/functions/serverOverview";
import {
  findServerPlayercountById,
  findServerPlayercounts,
} from "services/mongodbServices/functions/serverPlayercount";
import {
  findSupportMessageById,
  findSupportMessages,
} from "services/mongodbServices/functions/supportMessage";

import adminRouteBuilder from "./adminRouteBuilder";

export default () => {
  const route = Router();

  route.use(
    "/addgroupchannel",
    adminRouteBuilder(
      AddgroupChannel,
      findAddgroupChannels,
      findAddgroupChannelById
    )
  );
  route.use(
    "/afkchannel",
    adminRouteBuilder(AfkChannel, findAfkChannels, findAfkChannelById)
  );
  route.use(
    "/customchannel",
    adminRouteBuilder(CustomChannel, findCustomChannels, findCustomChannelById)
  );
  route.use(
    "/joinmessage",
    adminRouteBuilder(JoinMessage, findJoinMessages, findJoinMessageById)
  );
  route.use(
    "/lobbychannel",
    adminRouteBuilder(LobbyChannel, findLobbyChannels, findLobbyChannelById)
  );
  route.use(
    "/onlinechannel",
    adminRouteBuilder(OnlineChannel, findOnlineChannels, findOnlineChannelById)
  );
  route.use(
    "/serveroverview",
    adminRouteBuilder(
      ServerOverview,
      findServerOverviews,
      findServerOverviewById
    )
  );
  route.use(
    "/serverplayercount",
    adminRouteBuilder(
      ServerPlayercount,
      findServerPlayercounts,
      findServerPlayercountById
    )
  );
  route.use(
    "/supportmessage",
    adminRouteBuilder(
      SupportMessage,
      findSupportMessages,
      findSupportMessageById
    )
  );

  return route;
};

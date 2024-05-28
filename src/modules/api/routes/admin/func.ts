import { Router } from "express";

import AddgroupChannel from "models/functions/AddgroupChannel";
import AfkChannel from "models/functions/AfkChannel";
import CustomChannel from "models/functions/CustomChannel";
import JoinMessage from "models/functions/JoinMessage";
import LobbyChannel from "models/functions/LobbyChannel";
import OnlineChannel from "models/functions/OnlineChannel";
import ServerDescription from "models/functions/ServerDescription";
import ServerTitle from "models/functions/ServerTitle";
import SupportMessage from "models/functions/SupportMessage";

import authCheck from "modules/api/middlewares/authCheck";

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
  findServerDescriptionById,
  findServerDescriptions,
} from "services/mongodbServices/functions/serverDescription";
import {
  findServerTitleById,
  findServerTitles,
} from "services/mongodbServices/functions/serverTitle";
import {
  findSupportMessageById,
  findSupportMessages,
} from "services/mongodbServices/functions/supportMessage";

import adminRouteBuilder from "./adminRouteBuilder";

export default () => {
  const route = Router();

  route.use(
    "/addgroupchannel",
    authCheck("manage_addgroupchannel"),
    adminRouteBuilder(
      AddgroupChannel,
      findAddgroupChannels,
      findAddgroupChannelById
    )
  );
  route.use(
    "/afkchannel",
    authCheck("manage_afkchannel"),
    adminRouteBuilder(AfkChannel, findAfkChannels, findAfkChannelById)
  );
  route.use(
    "/customchannel",
    authCheck("manage_customchannel"),
    adminRouteBuilder(CustomChannel, findCustomChannels, findCustomChannelById)
  );
  route.use(
    "/joinmessage",
    authCheck("manage_joinmessage"),
    adminRouteBuilder(JoinMessage, findJoinMessages, findJoinMessageById)
  );
  route.use(
    "/lobbychannel",
    authCheck("manage_lobbychannel"),
    adminRouteBuilder(LobbyChannel, findLobbyChannels, findLobbyChannelById)
  );
  route.use(
    "/onlinechannel",
    authCheck("manage_onlinechannel"),
    adminRouteBuilder(OnlineChannel, findOnlineChannels, findOnlineChannelById)
  );
  route.use(
    "/serverdescription",
    authCheck("manage_serverdescription"),
    adminRouteBuilder(
      ServerDescription,
      findServerDescriptions,
      findServerDescriptionById
    )
  );
  route.use(
    "/servertitle",
    authCheck("manage_servertitle"),
    adminRouteBuilder(ServerTitle, findServerTitles, findServerTitleById)
  );
  route.use(
    "/supportmessage",
    authCheck("manage_supportmessage"),
    adminRouteBuilder(
      SupportMessage,
      findSupportMessages,
      findSupportMessageById
    )
  );

  return route;
};

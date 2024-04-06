import { RequestHandler } from "express";
import {
  TeamSpeak,
  TeamSpeakChannel,
  TeamSpeakClient,
} from "ts3-nodejs-library";

import { IdError, UnknownTeamSpeakError } from "classes/htmlErrors";
import ListDataResponse from "classes/htmlSuccesses/ListDataResponse";

import { clientOnlineMapper } from "modules/api/mapper/clientMapper";
import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    const id = req.params.id;

    let channel: TeamSpeakChannel | undefined;
    try {
      channel = await teamspeak.getChannelById(id);
    } catch (error) {
      return restrictedNext(next, new UnknownTeamSpeakError());
    }

    if (channel === undefined) {
      return restrictedNext(next, new IdError(id));
    }

    let channelClients: TeamSpeakClient[];

    try {
      channelClients = await channel.getClients();
    } catch (error) {
      return restrictedNext(next, new UnknownTeamSpeakError());
    }

    const mappedClients = channelClients.map(clientOnlineMapper);

    restrictedResponse(res, new ListDataResponse(mappedClients));
  };
};

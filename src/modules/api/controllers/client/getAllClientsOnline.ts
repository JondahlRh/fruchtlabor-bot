import { RequestHandler } from "express";
import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import { UnknownTeamSpeakError } from "classes/htmlErrors";
import ListDataResponse from "classes/htmlSuccesses/ListDataResponse";

import { clientOnlineMapper } from "modules/api/mapper/clientMapper";
import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    let clientList: TeamSpeakClient[];
    try {
      clientList = await teamspeak.clientList();
    } catch (error) {
      return restrictedNext(next, new UnknownTeamSpeakError());
    }

    const mappedClientList = clientList.map(clientOnlineMapper);

    restrictedResponse(res, new ListDataResponse(mappedClientList));
  };
};

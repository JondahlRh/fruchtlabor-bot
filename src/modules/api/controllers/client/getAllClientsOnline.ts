import { RequestHandler } from "express";
import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import { UnkownTeamSpeakError } from "../../../../classes/htmlErrors";
import ListDataResponse from "../../../../classes/htmlSuccesses/ListDataResponse";
import { clientOnlineMapper } from "../../mapper/clientMapper";
import restrictedNext from "../../utility/restrictedNext";
import restrictedResponse from "../../utility/restrictedResponse";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    let clientList: TeamSpeakClient[];
    try {
      clientList = await teamspeak.clientList();
    } catch (error) {
      return restrictedNext(next, new UnkownTeamSpeakError());
    }

    const mappedClientList = clientList.map(clientOnlineMapper);

    restrictedResponse(res, new ListDataResponse(mappedClientList));
  };
};

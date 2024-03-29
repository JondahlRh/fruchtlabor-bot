import { IdError } from "classes/htmlErrors";
import SingleDataResponse from "classes/htmlSuccesses/SingleDataResponse";
import { RequestHandler } from "express";
import { clientOnlineMapper } from "modules/api/mapper/clientMapper";
import { getOnlineClient } from "modules/api/utility/getTeamspeakClient";
import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";
import { TeamSpeak } from "ts3-nodejs-library";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    const id = req.params.id;

    const onlineClient = await getOnlineClient(teamspeak, id);
    if (onlineClient === null) {
      return restrictedNext(next, new IdError(id));
    }

    const mappedClient = clientOnlineMapper(onlineClient);

    restrictedResponse(res, new SingleDataResponse(mappedClient));
  };
};

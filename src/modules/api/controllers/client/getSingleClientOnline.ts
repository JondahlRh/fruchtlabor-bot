import { RequestHandler } from "express";
import { TeamSpeak } from "ts3-nodejs-library";

import { IdError } from "../../../../classes/htmlErrors";
import SingleDataResponse from "../../../../classes/htmlSuccesses/SingleDataResponse";
import { clientOnlineMapper } from "../../mapper/clientMapper";
import { getOnlineClient } from "../../utility/getTeamspeakClient";
import restrictedNext from "../../utility/restrictedNext";
import restrictedResponse from "../../utility/restrictedResponse";

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

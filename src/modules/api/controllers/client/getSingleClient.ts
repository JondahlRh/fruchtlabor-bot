import { RequestHandler } from "express";
import { TeamSpeak } from "ts3-nodejs-library";

import { IdError } from "../../../../classes/htmlErrors";
import SingleDataResponse from "../../../../classes/htmlSuccesses/SingleDataResponse";
import { clientMapper } from "../../mapper/clientMapper";
import { getDbClient } from "../../utility/getTeamspeakClient";
import restrictedNext from "../../utility/restrictedNext";
import restrictedResponse from "../../utility/restrictedResponse";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    const id = req.params.id;

    const dbClient = await getDbClient(teamspeak, id);
    if (dbClient === null) {
      return restrictedNext(next, new IdError(id));
    }

    const mappedClient = clientMapper(dbClient);

    restrictedResponse(res, new SingleDataResponse(mappedClient));
  };
};

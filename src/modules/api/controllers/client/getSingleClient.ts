import { RequestHandler } from "express";
import { TeamSpeak } from "ts3-nodejs-library";

import { IdError } from "classes/htmlErrors";
import SingleDataResponse from "classes/htmlSuccesses/SingleDataResponse";

import { clientMapper } from "modules/api/mapper/clientMapper";
import { getDbClient } from "modules/api/utility/getTeamspeakClient";
import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";

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

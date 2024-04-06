import { RequestHandler } from "express";
import { TeamSpeak, TeamSpeakServerGroup } from "ts3-nodejs-library";
import { ServerGroupClientEntry } from "ts3-nodejs-library/lib/types/ResponseTypes";

import { IdError, UnknownTeamSpeakError } from "classes/htmlErrors";
import ListDataResponse from "classes/htmlSuccesses/ListDataResponse";

import { clientMapper } from "modules/api/mapper/clientMapper";
import { getDbClient } from "modules/api/utility/getTeamspeakClient";
import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    const id = req.params.id;

    let servergroup: TeamSpeakServerGroup | undefined;
    try {
      servergroup = await teamspeak.getServerGroupById(id);
    } catch (error) {
      return restrictedNext(next, new UnknownTeamSpeakError());
    }

    if (servergroup === undefined) {
      return restrictedNext(next, new IdError(id));
    }

    let servergroupClientList: ServerGroupClientEntry[];
    try {
      servergroupClientList = await servergroup.clientList();
    } catch (error) {
      return restrictedNext(next, new UnknownTeamSpeakError());
    }

    const mappedClients: MappedClient[] = [];

    for (const sgClient of servergroupClientList) {
      const dbClient = await getDbClient(teamspeak, sgClient.cldbid);
      if (dbClient === null) continue;

      const mappedClient = clientMapper(dbClient);

      mappedClients.push(mappedClient);
    }

    restrictedResponse(res, new ListDataResponse(mappedClients));
  };
};

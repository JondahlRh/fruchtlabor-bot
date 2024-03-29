import { RequestHandler } from "express";
import { TeamSpeak, TeamSpeakServerGroup } from "ts3-nodejs-library";

import { IdError, UnkownTeamSpeakError } from "classes/htmlErrors";
import SingleDataResponse from "classes/htmlSuccesses/SingleDataResponse";

import servergroupMapper from "modules/api/mapper/servergroupMapper";
import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    const id = req.params.id;

    let servergroup: TeamSpeakServerGroup | undefined;
    try {
      servergroup = await teamspeak.getServerGroupById(id);
    } catch (error) {
      return restrictedNext(next, new UnkownTeamSpeakError());
    }

    if (servergroup === undefined) {
      return restrictedNext(next, new IdError(id));
    }

    const mappedServergroup = servergroupMapper(servergroup);

    restrictedResponse(res, new SingleDataResponse(mappedServergroup));
  };
};

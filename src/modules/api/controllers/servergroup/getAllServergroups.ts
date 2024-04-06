import { RequestHandler } from "express";
import { TeamSpeak, TeamSpeakServerGroup } from "ts3-nodejs-library";

import { UnknownTeamSpeakError } from "classes/htmlErrors";
import ListDataResponse from "classes/htmlSuccesses/ListDataResponse";

import servergroupMapper from "modules/api/mapper/servergroupMapper";
import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    let servergroupList: TeamSpeakServerGroup[];
    try {
      servergroupList = await teamspeak.serverGroupList();
    } catch (error) {
      return restrictedNext(next, new UnknownTeamSpeakError());
    }

    const mappedServergroupList = servergroupList.map(servergroupMapper);

    restrictedResponse(res, new ListDataResponse(mappedServergroupList));
  };
};

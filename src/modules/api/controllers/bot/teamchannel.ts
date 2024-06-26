import { RequestHandler } from "express";
import { TeamSpeak } from "ts3-nodejs-library";

import { UnknownTeamSpeakError } from "classes/htmlErrors";
import SingleDataResponse from "classes/htmlSuccesses/SingleDataResponse";

import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";
import teamchannel from "modules/bot/controllers/description/teamchannel";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    try {
      await teamchannel(teamspeak);
    } catch (error) {
      return restrictedNext(next, new UnknownTeamSpeakError());
    }

    restrictedResponse(res, new SingleDataResponse(true));
  };
};

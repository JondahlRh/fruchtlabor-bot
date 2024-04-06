import { RequestHandler } from "express";
import { TeamSpeak, TeamSpeakChannel } from "ts3-nodejs-library";

import { IdError, UnknownTeamSpeakError } from "classes/htmlErrors";
import SingleDataResponse from "classes/htmlSuccesses/SingleDataResponse";

import channelMapper from "modules/api/mapper/channelMapper";
import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    const id = req.params.id;

    let channel: TeamSpeakChannel | undefined;
    try {
      channel = await teamspeak.getChannelById(id);
    } catch (error) {
      return restrictedNext(next, new UnknownTeamSpeakError());
    }

    if (channel === undefined) {
      return restrictedNext(next, new IdError(id));
    }

    const mappedChannel = channelMapper(channel);

    restrictedResponse(res, new SingleDataResponse(mappedChannel));
  };
};

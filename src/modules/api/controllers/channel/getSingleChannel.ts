import { RequestHandler } from "express";
import { TeamSpeak, TeamSpeakChannel } from "ts3-nodejs-library";

import { IdError, UnkownTeamSpeakError } from "../../../../classes/htmlErrors";
import SingleDataResponse from "../../../../classes/htmlSuccesses/SingleDataResponse";
import channelMapper from "../../mapper/channelMapper";
import restrictedNext from "../../utility/restrictedNext";
import restrictedResponse from "../../utility/restrictedResponse";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    const id = req.params.id;

    let channel: TeamSpeakChannel | undefined;
    try {
      channel = await teamspeak.getChannelById(id);
    } catch (error) {
      return restrictedNext(next, new UnkownTeamSpeakError());
    }

    if (channel === undefined) {
      return restrictedNext(next, new IdError(id));
    }

    const mappedChannel = channelMapper(channel);

    restrictedResponse(res, new SingleDataResponse(mappedChannel));
  };
};

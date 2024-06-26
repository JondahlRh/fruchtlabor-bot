import { RequestHandler } from "express";
import { TeamSpeak, TeamSpeakChannel } from "ts3-nodejs-library";

import { UnknownTeamSpeakError } from "classes/htmlErrors";
import ListDataResponse from "classes/htmlSuccesses/ListDataResponse";

import channelMapper from "modules/api/mapper/channelMapper";
import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    let channelList: TeamSpeakChannel[];
    try {
      channelList = await teamspeak.channelList();
    } catch (error) {
      return restrictedNext(next, new UnknownTeamSpeakError());
    }

    const mappedChannelList = channelList.map(channelMapper);

    restrictedResponse(res, new ListDataResponse(mappedChannelList));
  };
};

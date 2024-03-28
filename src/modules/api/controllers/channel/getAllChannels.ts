import { RequestHandler } from "express";
import { TeamSpeak, TeamSpeakChannel } from "ts3-nodejs-library";

import { UnkownTeamSpeakError } from "../../../../classes/htmlErrors";
import ListDataResponse from "../../../../classes/htmlSuccesses/ListDataResponse";
import channelMapper from "../../mapper/channelMapper";
import restrictedNext from "../../utility/restrictedNext";
import restrictedResponse from "../../utility/restrictedResponse";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    let channelList: TeamSpeakChannel[];
    try {
      channelList = await teamspeak.channelList();
    } catch (error) {
      return restrictedNext(next, new UnkownTeamSpeakError());
    }

    const mappedChannelList = channelList.map(channelMapper);

    restrictedResponse(res, new ListDataResponse(mappedChannelList));
  };
};

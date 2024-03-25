import { RequestHandler } from "express";
import {
  TeamSpeak,
  TeamSpeakChannel,
  TeamSpeakClient,
} from "ts3-nodejs-library";

import { IdError, UnkownTeamSpeakError } from "../../../classes/htmlErrors";
import ListDataResponse from "../../../classes/htmlSuccesses/ListDataResponse";
import SingleDataResponse from "../../../classes/htmlSuccesses/SingleDataResponse";
import channelMapper from "../mapper/channelMapper";
import { clientOnlineMapper } from "../mapper/clientMapper";
import restrictedNext from "../utility/restrictedNext";
import restrictedResponse from "../utility/restrictedResponse";

const channel = (teamspeak: TeamSpeak) => {
  const getAllChannels: RequestHandler = async (req, res, next) => {
    let channelList: TeamSpeakChannel[];
    try {
      channelList = await teamspeak.channelList();
    } catch (error) {
      return restrictedNext(next, new UnkownTeamSpeakError());
    }

    const mappedChannelList = channelList.map(channelMapper);

    restrictedResponse(res, new ListDataResponse(mappedChannelList));
  };

  const getSingleChannel: RequestHandler = async (req, res, next) => {
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

  const getClientsOfChannel: RequestHandler = async (req, res, next) => {
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

    let channelClients: TeamSpeakClient[];

    try {
      channelClients = await channel.getClients();
    } catch (error) {
      return restrictedNext(next, new UnkownTeamSpeakError());
    }

    const mappedClients = channelClients.map(clientOnlineMapper);

    restrictedResponse(res, new ListDataResponse(mappedClients));
  };

  return { getAllChannels, getSingleChannel, getClientsOfChannel };
};

export default channel;

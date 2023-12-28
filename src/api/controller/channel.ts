import { RequestHandler } from "express";
import {
  TeamSpeak,
  TeamSpeakChannel,
  TeamSpeakClient,
} from "ts3-nodejs-library";

import channelMapper from "../mapper/channelMapper";
import clientMapper from "../mapper/clientMapper";
import restrictedNext from "../utility/restrictedNext";

const channel = (teamspeak: TeamSpeak) => {
  const getAllChannels: RequestHandler = async (req, res, next) => {
    let channelList: TeamSpeakChannel[];
    try {
      channelList = await teamspeak.channelList();
    } catch (error) {
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.UNKOWN_TEAMSPEAK_ERROR,
      });
    }

    const mappedChannelList = channelList.map(channelMapper);

    res.json(mappedChannelList);
  };

  const getSingleChannel: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    let channel: TeamSpeakChannel | undefined;
    try {
      channel = await teamspeak.getChannelById(id);
    } catch (error) {
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.UNKOWN_TEAMSPEAK_ERROR,
      });
    }

    if (channel === undefined) {
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.CHANNEL_DOES_NOT_EXIST,
        field: { key: "id", value: id },
      });
    }

    const mappedChannel = channelMapper(channel);

    res.json(mappedChannel);
  };

  const getClientsOfChannel: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    let channel: TeamSpeakChannel | undefined;
    try {
      channel = await teamspeak.getChannelById(id);
    } catch (error) {
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.UNKOWN_TEAMSPEAK_ERROR,
      });
    }

    if (channel === undefined) {
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.CHANNEL_DOES_NOT_EXIST,
        field: { key: "id", value: id },
      });
    }

    let channelClients: TeamSpeakClient[];

    try {
      channelClients = await channel.getClients();
    } catch (error) {
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.UNKOWN_TEAMSPEAK_ERROR,
      });
    }

    const mappedClients = channelClients.map(clientMapper);

    res.json(mappedClients);
  };

  return { getAllChannels, getSingleChannel, getClientsOfChannel };
};

export default channel;

import { RequestHandler } from "express";
import {
  TeamSpeak,
  TeamSpeakChannel,
  TeamSpeakClient,
} from "ts3-nodejs-library";

import {
  ChannelDoesNotExistError,
  UnkownTeamspeakError,
} from "../../../classes/htmlErrors";
import {
  ChannelList,
  ClientList,
  SingleChannel,
} from "../../../classes/htmlResponses";
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
      return restrictedNext(next, new UnkownTeamspeakError());
    }

    const mappedChannelList = channelList.map(channelMapper);

    restrictedResponse(res, new ChannelList(mappedChannelList));
  };

  const getSingleChannel: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    let channel: TeamSpeakChannel | undefined;
    try {
      channel = await teamspeak.getChannelById(id);
    } catch (error) {
      return restrictedNext(next, new UnkownTeamspeakError());
    }

    if (channel === undefined) {
      return restrictedNext(next, new ChannelDoesNotExistError("id", id));
    }

    const mappedChannel = channelMapper(channel);

    restrictedResponse(res, new SingleChannel(mappedChannel));
  };

  const getClientsOfChannel: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    let channel: TeamSpeakChannel | undefined;
    try {
      channel = await teamspeak.getChannelById(id);
    } catch (error) {
      return restrictedNext(next, new UnkownTeamspeakError());
    }

    if (channel === undefined) {
      return restrictedNext(next, new ChannelDoesNotExistError("id", id));
    }

    let channelClients: TeamSpeakClient[];

    try {
      channelClients = await channel.getClients();
    } catch (error) {
      return restrictedNext(next, new UnkownTeamspeakError());
    }

    const mappedClients = channelClients.map(clientOnlineMapper);

    restrictedResponse(res, new ClientList(mappedClients));
  };

  return { getAllChannels, getSingleChannel, getClientsOfChannel };
};

export default channel;

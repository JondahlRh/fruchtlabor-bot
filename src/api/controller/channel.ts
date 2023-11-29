import { Request, Response, NextFunction } from "express";
import {
  TeamSpeak,
  TeamSpeakChannel,
  TeamSpeakClient,
} from "ts3-nodejs-library";

import channelMapper from "../mapper/channelMapper";
import clientMapper from "../mapper/clientMapper";
import { HtmlError } from "../utility/HtmlError";

const channel = (teamspeak: TeamSpeak) => {
  const getAllChannels = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let channelList: TeamSpeakChannel[];
    try {
      channelList = await teamspeak.channelList();
    } catch (error) {
      return next(
        new HtmlError("Unkown teamspeak error!", 500, "UNKOWN_TEAMSPEAK_ERROR")
      );
    }

    const mappedChannelList = channelList.map(channelMapper);

    res.json(mappedChannelList);
  };

  const getSingleChannel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    let channel: TeamSpeakChannel | undefined;
    try {
      channel = await teamspeak.getChannelById(id);
    } catch (error) {
      return next(
        new HtmlError("Unkown teamspeak error!", 500, "UNKOWN_TEAMSPEAK_ERROR")
      );
    }

    if (channel === undefined) {
      return next(
        new HtmlError("Channel id does not exist!", 400, "UNKOWN_CHANNELID")
      );
    }

    const mappedChannel = channelMapper(channel);

    res.json(mappedChannel);
  };

  const getClientsOfChannel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    let channel: TeamSpeakChannel | undefined;
    try {
      channel = await teamspeak.getChannelById(id);
    } catch (error) {
      return next(
        new HtmlError("Unkown teamspeak error!", 500, "UNKOWN_TEAMSPEAK_ERROR")
      );
    }

    if (channel === undefined) {
      return next(
        new HtmlError("Channel id does not exist!", 400, "UNKOWN_CHANNELID")
      );
    }

    let channelClients: TeamSpeakClient[];

    try {
      channelClients = await channel.getClients();
    } catch (error) {
      return next(
        new HtmlError("Unkown teamspeak error!", 500, "UNKOWN_TEAMSPEAK_ERROR")
      );
    }

    const mappedClients = channelClients.map(clientMapper);

    res.json(mappedClients);
  };

  return { getAllChannels, getSingleChannel, getClientsOfChannel };
};

export default channel;

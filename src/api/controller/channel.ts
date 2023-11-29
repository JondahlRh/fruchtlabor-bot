import { Request, Response, NextFunction } from "express";
import { TeamSpeak } from "ts3-nodejs-library";

import channelMapper from "../mapper/channelMapper";
import clientMapper from "../mapper/clientMapper";
import { HtmlError } from "../utility/HtmlError";

const channel = (teamspeak: TeamSpeak) => {
  const getAllChannels = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const channelList = await teamspeak.channelList();

    const mappedChannelList = channelList.map(channelMapper);

    res.json(mappedChannelList);
  };

  const getSingleChannel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const channel = await teamspeak.getChannelById(id);
    if (channel === undefined) {
      return next(
        new HtmlError("Channel id does not exist!", 400, "CHANNEL_ID_UNKOWN")
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

    const channel = await teamspeak.getChannelById(id);
    if (channel === undefined) {
      return next(
        new HtmlError("Channel id does not exist!", 400, "CHANNEL_ID_UNKOWN")
      );
    }

    const channelClients = await channel.getClients();
    const mappedClients = channelClients.map(clientMapper);

    res.json(mappedClients);
  };

  return { getAllChannels, getSingleChannel, getClientsOfChannel };
};

export default channel;

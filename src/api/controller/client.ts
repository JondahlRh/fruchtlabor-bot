import { Request, Response, NextFunction } from "express";
import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";
import { ClientDBInfo } from "ts3-nodejs-library/lib/types/ResponseTypes";

import clientMapper from "../mapper/clientMapper";
import { HtmlError } from "../utility/HtmlError";

const servergroup = (teamspeak: TeamSpeak) => {
  const getSingleClientByUuid = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    let client: TeamSpeakClient | undefined;
    try {
      client = await teamspeak.getClientByUid(id);
    } catch (error) {
      return next(
        new HtmlError("Unkown teamspeak error!", 500, "UNKOWN_TEAMSPEAK_ERROR")
      );
    }

    if (client) {
      const mappedClient = clientMapper(client);
      return res.json(mappedClient);
    }

    let dbClient: ClientDBInfo;
    try {
      const dbidByUuid = await teamspeak.clientGetDbidFromUid(id);
      const dbClients = await teamspeak.clientDbInfo(dbidByUuid.cldbid);
      dbClient = dbClients[0];
    } catch (error) {
      return next(
        new HtmlError(
          "Client unqiue id does not exist!",
          400,
          "UNKOWN_CLIENTUUID"
        )
      );
    }

    const mappedClient = clientMapper(dbClient);

    return res.json(mappedClient);
  };

  const getSingleClientByDbid = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    let client: TeamSpeakClient | undefined;
    try {
      client = await teamspeak.getClientByDbid(id);
    } catch (error) {
      return next(
        new HtmlError("Unkown teamspeak error!", 500, "UNKOWN_TEAMSPEAK_ERROR")
      );
    }

    if (client) {
      const mappedClient = clientMapper(client);
      return res.json(mappedClient);
    }

    let dbClient: ClientDBInfo;
    try {
      const dbClients = await teamspeak.clientDbInfo(id);
      dbClient = dbClients[0];
    } catch (error) {
      return next(
        new HtmlError(
          "Client database id does not exist!",
          400,
          "UNKOWN_CLIENTDBID"
        )
      );
    }

    const mappedClient = clientMapper(dbClient);

    return res.json(mappedClient);
  };

  const getAllClientsOnline = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let clientList: TeamSpeakClient[];
    try {
      clientList = await teamspeak.clientList();
    } catch (error) {
      return next(
        new HtmlError("Unkown teamspeak error!", 500, "UNKOWN_TEAMSPEAK_ERROR")
      );
    }

    const mappedClients = clientList.map(clientMapper);

    res.json(mappedClients);
  };

  return { getSingleClientByUuid, getSingleClientByDbid, getAllClientsOnline };
};

export default servergroup;

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

    const client = await teamspeak.getClientByUid(id);

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
          "Client with unqiue id does not exist!",
          400,
          "CLIENT_UUID_UNKOWN"
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

    const client = await teamspeak.getClientByDbid(id);

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
          "Client with database id does not exist!",
          400,
          "CLIENT_DBID_UNKOWN"
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
    const clients = await teamspeak.clientList();

    const mappedClients = clients.map(clientMapper);

    res.json(mappedClients);
  };

  return { getSingleClientByUuid, getSingleClientByDbid, getAllClientsOnline };
};

export default servergroup;

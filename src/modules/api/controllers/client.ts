import { RequestHandler } from "express";
import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";
import { ClientDBInfo } from "ts3-nodejs-library/lib/types/ResponseTypes";

import ClientDoesNotExistError from "../../../classes/htmlErrors/ClientDoesNotExistError";
import UnkownTeamspeakError from "../../../classes/htmlErrors/UnkownTeamspeakError";
import clientMapper from "../mapper/clientMapper";
import restrictedNext from "../utility/restrictedNext";

const servergroup = (teamspeak: TeamSpeak) => {
  const getSingleClientByUuid: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    let client: TeamSpeakClient | undefined;
    try {
      client = await teamspeak.getClientByUid(id);
    } catch (error) {
      return restrictedNext(next, new UnkownTeamspeakError());
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
      return restrictedNext(next, new ClientDoesNotExistError("id", id));
    }

    const mappedClient = clientMapper(dbClient);

    return res.json(mappedClient);
  };

  const getSingleClientByDbid: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    let client: TeamSpeakClient | undefined;
    try {
      client = await teamspeak.getClientByDbid(id);
    } catch (error) {
      return restrictedNext(next, new UnkownTeamspeakError());
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
      return restrictedNext(next, new ClientDoesNotExistError("id", id));
    }

    const mappedClient = clientMapper(dbClient);

    return res.json(mappedClient);
  };

  const getAllClientsOnline: RequestHandler = async (req, res, next) => {
    let clientList: TeamSpeakClient[];
    try {
      clientList = await teamspeak.clientList();
    } catch (error) {
      return restrictedNext(next, new UnkownTeamspeakError());
    }

    const mappedClients = clientList.map(clientMapper);

    res.json(mappedClients);
  };

  return { getSingleClientByUuid, getSingleClientByDbid, getAllClientsOnline };
};

export default servergroup;

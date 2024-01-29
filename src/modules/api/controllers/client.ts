import { RequestHandler } from "express";
import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";
import { ClientDBInfo } from "ts3-nodejs-library/lib/types/ResponseTypes";

import ClientDoesNotExistError from "../../../classes/htmlErrors/ClientDoesNotExistError";
import ClientNotOnlineError from "../../../classes/htmlErrors/ClientNotOnlineError";
import UnkownTeamspeakError from "../../../classes/htmlErrors/UnkownTeamspeakError";
import WrongTypeError from "../../../classes/htmlErrors/WrongTypeError";
import { clientMapper, clientOnlineMapper } from "../mapper/clientMapper";
import { getDbClient, getOnlineClient } from "../utility/getTeamspeakClient";
import restrictedNext from "../utility/restrictedNext";

const servergroup = (teamspeak: TeamSpeak) => {
  const getSingleClient: RequestHandler = async (req, res, next) => {
    const client = req.params.id;

    const dbClient = await getDbClient(teamspeak, client);
    if (dbClient === null) {
      return restrictedNext(
        next,
        new ClientDoesNotExistError("client", client)
      );
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

    const mappedClients = clientList.map(clientOnlineMapper);

    res.json(mappedClients);
  };

  const getSingleClientOnline: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    const onlineClient = await getOnlineClient(teamspeak, id);
    if (onlineClient === null) {
      return restrictedNext(next, new ClientDoesNotExistError("id", id));
    }

    res.json(clientOnlineMapper(onlineClient));
  };

  const postBanClient: RequestHandler = async (req, res, next) => {
    const client: string = req.body.client;
    const banreason: string = req.body.banreason;

    if (typeof client !== "string") {
      return restrictedNext(
        next,
        new WrongTypeError("client", client, "string")
      );
    }
    if (typeof banreason !== "string") {
      return restrictedNext(
        next,
        new WrongTypeError("banreason", banreason, "string")
      );
    }

    const dbClient = await getDbClient(teamspeak, client);
    if (dbClient === null) {
      return restrictedNext(
        next,
        new ClientDoesNotExistError("client", client)
      );
    }

    try {
      await teamspeak.ban({ ip: dbClient.clientLastip, banreason });
      await teamspeak.ban({ uid: dbClient.clientUniqueIdentifier, banreason });
    } catch (error) {
      return restrictedNext(next, new UnkownTeamspeakError());
    }

    res.json({ message: "Succesfully banned client!" });
  };

  return {
    getSingleClient,
    getAllClientsOnline,
    getSingleClientOnline,
    postBanClient,
  };
};

export default servergroup;

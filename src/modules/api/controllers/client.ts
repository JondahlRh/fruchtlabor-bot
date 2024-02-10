import { RequestHandler } from "express";
import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import ClientDoesNotExistError from "../../../classes/htmlErrors/ClientDoesNotExistError";
import RequestBodyError from "../../../classes/htmlErrors/RequestBodyError";
import UnkownTeamspeakError from "../../../classes/htmlErrors/UnkownTeamspeakError";
import { BanClientSchema, ParamIdSchema } from "../../../types/apiBody";
import { clientMapper, clientOnlineMapper } from "../mapper/clientMapper";
import { getDbClient, getOnlineClient } from "../utility/getTeamspeakClient";
import restrictedNext from "../utility/restrictedNext";

const client = (teamspeak: TeamSpeak) => {
  const getSingleClient: RequestHandler = async (req, res, next) => {
    const requestParam = ParamIdSchema.safeParse(req.params.id);

    if (!requestParam.success) {
      return restrictedNext(
        next,
        new RequestBodyError(requestParam.error.message)
      );
    }

    const id = requestParam.data;

    const dbClient = await getDbClient(teamspeak, id);
    if (dbClient === null) {
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

    const mappedClients = clientList.map(clientOnlineMapper);

    res.json(mappedClients);
  };

  const getSingleClientOnline: RequestHandler = async (req, res, next) => {
    const requestParam = ParamIdSchema.safeParse(req.params.id);

    if (!requestParam.success) {
      return restrictedNext(
        next,
        new RequestBodyError(requestParam.error.message)
      );
    }

    const id = requestParam.data;

    const onlineClient = await getOnlineClient(teamspeak, id);
    if (onlineClient === null) {
      return restrictedNext(next, new ClientDoesNotExistError("id", id));
    }

    const mappedClient = clientOnlineMapper(onlineClient);

    res.json(mappedClient);
  };

  const postBanClient: RequestHandler = async (req, res, next) => {
    const requestBody = BanClientSchema.safeParse(req.body);

    if (!requestBody.success) {
      return restrictedNext(
        next,
        new RequestBodyError(requestBody.error.message)
      );
    }

    const { client, banreason } = requestBody.data;

    const dbClient = await getDbClient(teamspeak, client);
    if (dbClient === null) {
      return restrictedNext(
        next,
        new ClientDoesNotExistError("client", client)
      );
    }

    let ipBannId: string;
    let tsidBannId: string;
    try {
      const ipBann = await teamspeak.ban({
        ip: dbClient.clientLastip,
        banreason,
      });
      ipBannId = ipBann.banid;

      const tsidBann = await teamspeak.ban({
        uid: dbClient.clientUniqueIdentifier,
        banreason,
      });
      tsidBannId = tsidBann.banid;
    } catch (error) {
      return restrictedNext(next, new UnkownTeamspeakError());
    }

    res.json({
      message: "Succesfully banned client!",
      data: { ipBannId, tsidBannId },
    });
  };

  return {
    getSingleClient,
    getAllClientsOnline,
    getSingleClientOnline,
    postBanClient,
  };
};

export default client;

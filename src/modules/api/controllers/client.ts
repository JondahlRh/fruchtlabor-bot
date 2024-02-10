import { RequestHandler } from "express";
import { ResponseError, TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import BanIdDoesNotExistError from "../../../classes/htmlErrors/BanIdDoesNotExistError";
import ClientDoesNotExistError from "../../../classes/htmlErrors/ClientDoesNotExistError";
import PartialError from "../../../classes/htmlErrors/PartialError";
import RequestBodyError from "../../../classes/htmlErrors/RequestBodyError";
import UnkownTeamspeakError from "../../../classes/htmlErrors/UnkownTeamspeakError";
import {
  DelteBanClientSchema,
  ParamIdSchema,
  PostBanClientSchema,
} from "../../../types/apiBody";
import { SingleError } from "../../../types/error";
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
    const requestBody = PostBanClientSchema.safeParse(req.body);

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

  const deleteBanClient: RequestHandler = async (req, res, next) => {
    const requestBody = DelteBanClientSchema.safeParse(req.body);

    if (!requestBody.success) {
      return restrictedNext(
        next,
        new RequestBodyError(requestBody.error.message)
      );
    }

    const { banids } = requestBody.data;

    const errors: SingleError[] = [];
    await Promise.all(
      banids.map(async (banid) => {
        try {
          await teamspeak.banDel(banid);
        } catch (error) {
          if (!(error instanceof ResponseError)) {
            return errors.push(new UnkownTeamspeakError());
          }

          switch (error.msg) {
            case "invalid ban id":
              errors.push(new BanIdDoesNotExistError("banid", banid));
              break;

            default:
              errors.push(new UnkownTeamspeakError());
              break;
          }
        }
      })
    );

    if (errors.length > 0) {
      return restrictedNext(next, new PartialError(errors));
    }

    res.json({ message: "Succesfully removed Bans!" });
  };

  return {
    getSingleClient,
    getAllClientsOnline,
    getSingleClientOnline,
    postBanClient,
    deleteBanClient,
  };
};

export default client;

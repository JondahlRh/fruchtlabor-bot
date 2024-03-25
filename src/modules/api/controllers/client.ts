import { RequestHandler } from "express";
import { ResponseError, TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";
import { BanEntry } from "ts3-nodejs-library/lib/types/ResponseTypes";

import {
  BanIdDoesNotExistError,
  ClientDoesNotExistError,
  PartialError,
  RequestBodyError,
  UnkownTeamspeakError,
} from "../../../classes/htmlErrors";
import {
  BanList,
  ClientList,
  SingleBan,
  SingleClient,
} from "../../../classes/htmlResponses";
import DeleteBanResponse, {
  DeleteBanIdError,
  DeleteBanSuccess,
  DeleteBanUnkownError,
  DeletedBanStatus,
} from "../../../classes/htmlResponses/deleteBanResponse";
import PostBanResponse from "../../../classes/htmlResponses/postBanResponse";
import {
  DelteBanClientSchema,
  PostBanClientSchema,
} from "../../../types/apiBody";
import { SingleError } from "../../../types/error";
import banMapper from "../mapper/banMapper";
import { clientMapper, clientOnlineMapper } from "../mapper/clientMapper";
import { getDbClient, getOnlineClient } from "../utility/getTeamspeakClient";
import restrictedNext from "../utility/restrictedNext";
import restrictedResponse from "../utility/restrictedResponse";

const client = (teamspeak: TeamSpeak) => {
  const getSingleClient: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    const dbClient = await getDbClient(teamspeak, id);
    if (dbClient === null) {
      return restrictedNext(next, new ClientDoesNotExistError("id", id));
    }

    const mappedClient = clientMapper(dbClient);

    restrictedResponse(res, new SingleClient(mappedClient));
  };

  const getAllClientsOnline: RequestHandler = async (req, res, next) => {
    let clientList: TeamSpeakClient[];
    try {
      clientList = await teamspeak.clientList();
    } catch (error) {
      return restrictedNext(next, new UnkownTeamspeakError());
    }

    const mappedClientList = clientList.map(clientOnlineMapper);

    restrictedResponse(res, new ClientList(mappedClientList));
  };

  const getSingleClientOnline: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    const onlineClient = await getOnlineClient(teamspeak, id);
    if (onlineClient === null) {
      return restrictedNext(next, new ClientDoesNotExistError("id", id));
    }

    const mappedClient = clientOnlineMapper(onlineClient);

    restrictedResponse(res, new SingleClient(mappedClient));
  };

  const getBanList: RequestHandler = async (req, res, next) => {
    let banList: BanEntry[];
    try {
      banList = await teamspeak.banList();
    } catch (error) {
      if (!(error instanceof ResponseError)) {
        return restrictedNext(next, new UnkownTeamspeakError());
      }

      switch (error.msg) {
        case "database empty result set":
          banList = [];
          break;

        default:
          return restrictedNext(next, new UnkownTeamspeakError());
      }
    }

    const mappedBanList = banList.map(banMapper);

    restrictedResponse(res, new BanList(mappedBanList));
  };

  const getSingleBan: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    let banList: BanEntry[];
    try {
      banList = await teamspeak.banList();
    } catch (error) {
      if (!(error instanceof ResponseError)) {
        return restrictedNext(next, new UnkownTeamspeakError());
      }

      switch (error.msg) {
        case "database empty result set":
          banList = [];
          break;

        default:
          return restrictedNext(next, new UnkownTeamspeakError());
      }
    }

    const singleBan = banList.find((x) => x.banid === id);
    if (singleBan === undefined) {
      return restrictedNext(next, new BanIdDoesNotExistError("id", id));
    }

    const mappedBan = banMapper(singleBan);

    restrictedResponse(res, new SingleBan(mappedBan));
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

    let ipBanId: string | null = null;
    try {
      const ipBann = await teamspeak.ban({
        ip: dbClient.clientLastip,
        banreason,
      });
      ipBanId = ipBann.banid;
    } catch (error) {}

    let tsidBanId: string | null = null;
    try {
      const tsidBann = await teamspeak.ban({
        uid: dbClient.clientUniqueIdentifier,
        banreason,
      });
      tsidBanId = tsidBann.banid;
    } catch (error) {}

    restrictedResponse(res, new PostBanResponse(ipBanId, tsidBanId));
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

    const deletedBanStatusList: DeletedBanStatus[] = [];
    await Promise.all(
      banids.map(async (banid) => {
        try {
          await teamspeak.banDel(banid);
          deletedBanStatusList.push(new DeleteBanSuccess(banid));
          return;
        } catch (error) {
          if (!(error instanceof ResponseError)) {
            deletedBanStatusList.push(new DeleteBanUnkownError(banid));
            return;
          }

          switch (error.msg) {
            case "invalid ban id":
              deletedBanStatusList.push(new DeleteBanIdError(banid));
              return;

            default:
              deletedBanStatusList.push(new DeleteBanUnkownError(banid));
              return;
          }
        }
      })
    );

    restrictedResponse(res, new DeleteBanResponse(deletedBanStatusList));
  };

  return {
    getSingleClient,
    getAllClientsOnline,
    getSingleClientOnline,
    getBanList,
    getSingleBan,
    postBanClient,
    deleteBanClient,
  };
};

export default client;

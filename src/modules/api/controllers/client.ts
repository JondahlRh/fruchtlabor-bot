import { RequestHandler } from "express";
import { ResponseError, TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";
import { BanEntry } from "ts3-nodejs-library/lib/types/ResponseTypes";
import { fromZodError } from "zod-validation-error";

import {
  IdError,
  RequestBodyError,
  UnkownTeamSpeakError,
} from "../../../classes/htmlErrors";
import ListDataResponse from "../../../classes/htmlSuccesses/ListDataResponse";
import PostBanResponse from "../../../classes/htmlSuccesses/PostBanResponse";
import SingleDataResponse from "../../../classes/htmlSuccesses/SingleDataResponse";
import PartialSuccessResponse, {
  PartialResponse,
  PartialIdError,
  PartialUnkownTeamspeakError,
} from "../../../classes/partial";
import PartialSuccess from "../../../classes/partial/PartialSuccess";
import {
  DelteBanClientSchema,
  PostBanClientSchema,
} from "../../../types/apiBody";
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
      return restrictedNext(next, new IdError(id));
    }

    const mappedClient = clientMapper(dbClient);

    restrictedResponse(res, new SingleDataResponse(mappedClient));
  };

  const getAllClientsOnline: RequestHandler = async (req, res, next) => {
    let clientList: TeamSpeakClient[];
    try {
      clientList = await teamspeak.clientList();
    } catch (error) {
      return restrictedNext(next, new UnkownTeamSpeakError());
    }

    const mappedClientList = clientList.map(clientOnlineMapper);

    restrictedResponse(res, new ListDataResponse(mappedClientList));
  };

  const getSingleClientOnline: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    const onlineClient = await getOnlineClient(teamspeak, id);
    if (onlineClient === null) {
      return restrictedNext(next, new IdError(id));
    }

    const mappedClient = clientOnlineMapper(onlineClient);

    restrictedResponse(res, new SingleDataResponse(mappedClient));
  };

  const getBanList: RequestHandler = async (req, res, next) => {
    let banList: BanEntry[];
    try {
      banList = await teamspeak.banList();
    } catch (error) {
      if (!(error instanceof ResponseError)) {
        return restrictedNext(next, new UnkownTeamSpeakError());
      }

      switch (error.msg) {
        case "database empty result set":
          banList = [];
          break;

        default:
          return restrictedNext(next, new UnkownTeamSpeakError());
      }
    }

    const mappedBanList = banList.map(banMapper);

    restrictedResponse(res, new ListDataResponse(mappedBanList));
  };

  const getSingleBan: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    let banList: BanEntry[];
    try {
      banList = await teamspeak.banList();
    } catch (error) {
      if (!(error instanceof ResponseError)) {
        return restrictedNext(next, new UnkownTeamSpeakError());
      }

      switch (error.msg) {
        case "database empty result set":
          banList = [];
          break;

        default:
          return restrictedNext(next, new UnkownTeamSpeakError());
      }
    }

    const singleBan = banList.find((x) => x.banid === id);
    if (singleBan === undefined) {
      return restrictedNext(next, new IdError(id));
    }

    const mappedBan = banMapper(singleBan);

    restrictedResponse(res, new SingleDataResponse(mappedBan));
  };

  const postBanClient: RequestHandler = async (req, res, next) => {
    const requestBody = PostBanClientSchema.safeParse(req.body);

    if (!requestBody.success) {
      return restrictedNext(
        next,
        new RequestBodyError(fromZodError(requestBody.error).toString())
      );
    }

    const { client, banreason } = requestBody.data;

    const dbClient = await getDbClient(teamspeak, client);
    if (dbClient === null) {
      return restrictedNext(next, new IdError(client));
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
        new RequestBodyError(fromZodError(requestBody.error).toString())
      );
    }

    const { banids } = requestBody.data;

    const partialResponses: PartialResponse[] = [];
    await Promise.all(
      banids.map(async (banid) => {
        try {
          await teamspeak.banDel(banid);
          partialResponses.push(new PartialSuccess(banid));
          return;
        } catch (error) {
          if (!(error instanceof ResponseError)) {
            partialResponses.push(new PartialUnkownTeamspeakError(banid));
            return;
          }

          switch (error.msg) {
            case "invalid ban id":
              partialResponses.push(new PartialIdError(banid));
              return;

            default:
              partialResponses.push(new PartialUnkownTeamspeakError(banid));
              return;
          }
        }
      })
    );

    restrictedResponse(res, new PartialSuccessResponse(partialResponses));
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

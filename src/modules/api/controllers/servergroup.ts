import { RequestHandler } from "express";
import {
  ResponseError,
  TeamSpeak,
  TeamSpeakServerGroup,
} from "ts3-nodejs-library";
import { ServerGroupClientEntry } from "ts3-nodejs-library/lib/types/ResponseTypes";
import { fromZodError } from "zod-validation-error";

import {
  IdError,
  RequestBodyError,
  UnkownTeamSpeakError,
} from "../../../classes/htmlErrors";
import ListDataResponse from "../../../classes/htmlSuccesses/ListDataResponse";
import SingleDataResponse from "../../../classes/htmlSuccesses/SingleDataResponse";
import DeleteAllServergroupsResponse from "../../../classes/htmlSuccesses/deleteAllServergroupsResponse";
import PartialSuccessResponse, {
  PartialResponse,
  PartialDuplicateError,
  PartialEmptyError,
  PartialIdError,
  PartialUnkownTeamspeakError,
} from "../../../classes/partial";
import PartialSuccess from "../../../classes/partial/PartialSuccess";
import {
  DelteAllServergroupsSchema,
  EditServergroupSchema,
} from "../../../types/apiBody";
import { clientMapper } from "../mapper/clientMapper";
import servergroupMapper from "../mapper/servergroupMapper";
import { getDbClient } from "../utility/getTeamspeakClient";
import restrictedNext from "../utility/restrictedNext";
import restrictedResponse from "../utility/restrictedResponse";

const servergroup = (teamspeak: TeamSpeak) => {
  const getAllServergroups: RequestHandler = async (req, res, next) => {
    let servergroupList: TeamSpeakServerGroup[];
    try {
      servergroupList = await teamspeak.serverGroupList();
    } catch (error) {
      return restrictedNext(next, new UnkownTeamSpeakError());
    }

    const mappedServergroupList = servergroupList.map(servergroupMapper);

    restrictedResponse(res, new ListDataResponse(mappedServergroupList));
  };

  const getSingleServergroup: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    let servergroup: TeamSpeakServerGroup | undefined;
    try {
      servergroup = await teamspeak.getServerGroupById(id);
    } catch (error) {
      return restrictedNext(next, new UnkownTeamSpeakError());
    }

    if (servergroup === undefined) {
      return restrictedNext(next, new IdError(id));
    }

    const mappedServergroup = servergroupMapper(servergroup);

    restrictedResponse(res, new SingleDataResponse(mappedServergroup));
  };

  const getClientsOfServergroup: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    let servergroup: TeamSpeakServerGroup | undefined;
    try {
      servergroup = await teamspeak.getServerGroupById(id);
    } catch (error) {
      return restrictedNext(next, new UnkownTeamSpeakError());
    }

    if (servergroup === undefined) {
      return restrictedNext(next, new IdError(id));
    }

    let servergroupClientList: ServerGroupClientEntry[];
    try {
      servergroupClientList = await servergroup.clientList();
    } catch (error) {
      return restrictedNext(next, new UnkownTeamSpeakError());
    }

    const mappedClients: MappedClient[] = [];

    for (const sgClient of servergroupClientList) {
      const dbClient = await getDbClient(teamspeak, sgClient.cldbid);
      if (dbClient === null) continue;

      const mappedClient = clientMapper(dbClient);

      mappedClients.push(mappedClient);
    }

    restrictedResponse(res, new ListDataResponse(mappedClients));
  };

  const putServergroup: RequestHandler = async (req, res, next) => {
    const requestBody = EditServergroupSchema.safeParse(req.body);

    if (!requestBody.success) {
      return restrictedNext(
        next,
        new RequestBodyError(fromZodError(requestBody.error).toString())
      );
    }

    const { client, servergroups } = requestBody.data;

    const dbClient = await getDbClient(teamspeak, client);
    if (dbClient === null) {
      return restrictedNext(next, new IdError(client));
    }

    const partialResponses: PartialResponse[] = [];
    await Promise.all(
      servergroups.map(async (servergroup) => {
        try {
          await teamspeak.clientAddServerGroup(
            dbClient.clientDatabaseId,
            servergroup
          );
          partialResponses.push(new PartialSuccess(servergroup));
        } catch (error) {
          if (!(error instanceof ResponseError)) {
            partialResponses.push(new PartialUnkownTeamspeakError(servergroup));
            return;
          }

          switch (error.msg) {
            case "invalid group ID":
              partialResponses.push(new PartialIdError(servergroup));
              return;

            case "duplicate entry":
              partialResponses.push(new PartialDuplicateError(servergroup));
              return;

            default:
              partialResponses.push(
                new PartialUnkownTeamspeakError(servergroup)
              );
              return;
          }
        }
      })
    );

    restrictedResponse(res, new PartialSuccessResponse(partialResponses));
  };

  const deleteServergroup: RequestHandler = async (req, res, next) => {
    const requestBody = EditServergroupSchema.safeParse(req.body);

    if (!requestBody.success) {
      return restrictedNext(
        next,
        new RequestBodyError(fromZodError(requestBody.error).toString())
      );
    }

    const { client, servergroups } = requestBody.data;

    const dbClient = await getDbClient(teamspeak, client);
    if (dbClient === null) {
      return restrictedNext(next, new IdError(client));
    }

    const partialResponses: PartialResponse[] = [];
    await Promise.all(
      servergroups.map(async (servergroup) => {
        try {
          await teamspeak.clientDelServerGroup(
            dbClient.clientDatabaseId,
            servergroup
          );
          partialResponses.push(new PartialSuccess(servergroup));
        } catch (error) {
          if (!(error instanceof ResponseError)) {
            partialResponses.push(new PartialUnkownTeamspeakError(servergroup));
            return;
          }

          switch (error.msg) {
            case "invalid group ID":
              partialResponses.push(new PartialIdError(servergroup));
              return;

            case "empty result set":
              partialResponses.push(new PartialEmptyError(servergroup));
              return;

            default:
              partialResponses.push(
                new PartialUnkownTeamspeakError(servergroup)
              );
              return;
          }
        }
      })
    );

    restrictedResponse(res, new PartialSuccessResponse(partialResponses));
  };

  const deleteAllServergroups: RequestHandler = async (req, res, next) => {
    const requestBody = DelteAllServergroupsSchema.safeParse(req.body);

    if (!requestBody.success) {
      return restrictedNext(
        next,
        new RequestBodyError(fromZodError(requestBody.error).toString())
      );
    }

    const { client } = requestBody.data;

    const dbClient = await getDbClient(teamspeak, client);
    if (dbClient === null) {
      return restrictedNext(next, new IdError(client));
    }

    let servergroups: string[];
    try {
      const serverGroupsByClientId = await teamspeak.serverGroupsByClientId(
        dbClient.clientDatabaseId
      );

      servergroups = serverGroupsByClientId.map((x) => x.sgid);
    } catch (error) {
      return restrictedNext(next, new UnkownTeamSpeakError());
    }

    try {
      await teamspeak.clientDelServerGroup(
        dbClient.clientDatabaseId,
        servergroups
      );
    } catch (error) {
      return restrictedNext(next, new UnkownTeamSpeakError());
    }

    restrictedResponse(res, new DeleteAllServergroupsResponse());
  };

  return {
    getAllServergroups,
    getSingleServergroup,
    getClientsOfServergroup,
    putServergroup,
    deleteServergroup,
    deleteAllServergroups,
  };
};

export default servergroup;

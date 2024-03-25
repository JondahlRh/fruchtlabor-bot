import { RequestHandler } from "express";
import {
  ResponseError,
  TeamSpeak,
  TeamSpeakServerGroup,
} from "ts3-nodejs-library";
import { ServerGroupClientEntry } from "ts3-nodejs-library/lib/types/ResponseTypes";

import {
  ClientDoesNotExistError,
  PartialError,
  RequestBodyError,
  ServergroupDoesNotExistError,
  ServergroupDuplicateEntry,
  ServergroupEmptyResult,
  UnkownTeamspeakError,
} from "../../../classes/htmlErrors";
import {
  ClientList,
  ServergroupList,
  SingleServergroup,
} from "../../../classes/htmlResponses";
import DeleteServergroupResponse, {
  DeleteServergroupEmptyError,
  DeleteServergroupIdError,
  DeleteServergroupStatus,
  DeleteServergroupSuccess,
  DeleteServergroupUnkownError,
} from "../../../classes/htmlResponses/deleteServergroupResponse";
import PutServergroupResponse, {
  PutServergroupDuplicateError,
  PutServergroupIdError,
  PutServergroupStatus,
  PutServergroupSuccess,
  PutServergroupUnkownError,
} from "../../../classes/htmlResponses/putServergroupResponse";
import {
  DelteAllServergroupsSchema,
  EditServergroupSchema,
} from "../../../types/apiBody";
import { SingleError } from "../../../types/error";
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
      return restrictedNext(next, new UnkownTeamspeakError());
    }

    const mappedServergroupList = servergroupList.map(servergroupMapper);

    restrictedResponse(res, new ServergroupList(mappedServergroupList));
  };

  const getSingleServergroup: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    let servergroup: TeamSpeakServerGroup | undefined;
    try {
      servergroup = await teamspeak.getServerGroupById(id);
    } catch (error) {
      return restrictedNext(next, new UnkownTeamspeakError());
    }

    if (servergroup === undefined) {
      return restrictedNext(next, new ServergroupDoesNotExistError("id", id));
    }

    const mappedServergroup = servergroupMapper(servergroup);

    restrictedResponse(res, new SingleServergroup(mappedServergroup));
  };

  const getClientsOfServergroup: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    let servergroup: TeamSpeakServerGroup | undefined;
    try {
      servergroup = await teamspeak.getServerGroupById(id);
    } catch (error) {
      return restrictedNext(next, new UnkownTeamspeakError());
    }

    if (servergroup === undefined) {
      return restrictedNext(next, new ServergroupDoesNotExistError("id", id));
    }

    let servergroupClientList: ServerGroupClientEntry[];
    try {
      servergroupClientList = await servergroup.clientList();
    } catch (error) {
      return restrictedNext(next, new UnkownTeamspeakError());
    }

    const mappedClients: MappedClient[] = [];

    for (const sgClient of servergroupClientList) {
      const dbClient = await getDbClient(teamspeak, sgClient.cldbid);
      if (dbClient === null) continue;

      const mappedClient = clientMapper(dbClient);

      mappedClients.push(mappedClient);
    }

    restrictedResponse(res, new ClientList(mappedClients));
  };

  const putServergroup: RequestHandler = async (req, res, next) => {
    const requestBody = EditServergroupSchema.safeParse(req.body);

    if (!requestBody.success) {
      return restrictedNext(
        next,
        new RequestBodyError(requestBody.error.message)
      );
    }

    const { client, servergroups } = requestBody.data;

    const dbClient = await getDbClient(teamspeak, client);
    if (dbClient === null) {
      return restrictedNext(
        next,
        new ClientDoesNotExistError("client", client)
      );
    }

    const putServergroupStatus: PutServergroupStatus[] = [];
    await Promise.all(
      servergroups.map(async (servergroup) => {
        try {
          await teamspeak.clientAddServerGroup(
            dbClient.clientDatabaseId,
            servergroup
          );
          putServergroupStatus.push(new PutServergroupSuccess(servergroup));
        } catch (error) {
          if (!(error instanceof ResponseError)) {
            putServergroupStatus.push(
              new PutServergroupUnkownError(servergroup)
            );
            return;
          }

          switch (error.msg) {
            case "invalid group ID":
              putServergroupStatus.push(new PutServergroupIdError(servergroup));
              return;

            case "duplicate entry":
              putServergroupStatus.push(
                new PutServergroupDuplicateError(servergroup)
              );
              return;

            default:
              putServergroupStatus.push(
                new PutServergroupUnkownError(servergroup)
              );
              return;
          }
        }
      })
    );

    restrictedResponse(res, new PutServergroupResponse(putServergroupStatus));

    res.json({ message: "Succesfull added servergroups!" });
  };

  const deleteServergroup: RequestHandler = async (req, res, next) => {
    const requestBody = EditServergroupSchema.safeParse(req.body);

    if (!requestBody.success) {
      return restrictedNext(
        next,
        new RequestBodyError(requestBody.error.message)
      );
    }

    const { client, servergroups } = requestBody.data;

    const dbClient = await getDbClient(teamspeak, client);
    if (dbClient === null) {
      return restrictedNext(
        next,
        new ClientDoesNotExistError("client", client)
      );
    }

    const deleteServergroupStatus: DeleteServergroupStatus[] = [];
    await Promise.all(
      servergroups.map(async (servergroup) => {
        try {
          await teamspeak.clientDelServerGroup(
            dbClient.clientDatabaseId,
            servergroup
          );
          deleteServergroupStatus.push(
            new DeleteServergroupSuccess(servergroup)
          );
        } catch (error) {
          if (!(error instanceof ResponseError)) {
            deleteServergroupStatus.push(
              new DeleteServergroupUnkownError(servergroup)
            );
            return;
          }

          switch (error.msg) {
            case "invalid group ID":
              deleteServergroupStatus.push(
                new DeleteServergroupIdError(servergroup)
              );
              return;

            case "empty result set":
              deleteServergroupStatus.push(
                new DeleteServergroupEmptyError(servergroup)
              );
              return;

            default:
              deleteServergroupStatus.push(
                new DeleteServergroupUnkownError(servergroup)
              );
              return;
          }
        }
      })
    );

    restrictedResponse(
      res,
      new DeleteServergroupResponse(deleteServergroupStatus)
    );
  };

  const deleteAllServergroups: RequestHandler = async (req, res, next) => {
    const requestBody = DelteAllServergroupsSchema.safeParse(req.body);

    if (!requestBody.success) {
      return restrictedNext(
        next,
        new RequestBodyError(requestBody.error.message)
      );
    }

    const { client } = requestBody.data;

    const dbClient = await getDbClient(teamspeak, client);
    if (dbClient === null) {
      return restrictedNext(
        next,
        new ClientDoesNotExistError("client", client)
      );
    }

    let servergroups: string[];
    try {
      const serverGroupsByClientId = await teamspeak.serverGroupsByClientId(
        dbClient.clientDatabaseId
      );

      servergroups = serverGroupsByClientId.map((x) => x.sgid);
    } catch (error) {
      return restrictedNext(next, new UnkownTeamspeakError());
    }

    try {
      await teamspeak.clientDelServerGroup(
        dbClient.clientDatabaseId,
        servergroups
      );
    } catch (error) {
      return restrictedNext(next, new UnkownTeamspeakError());
    }

    res.json({ message: "Succesfull removed all servergroups!" });
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

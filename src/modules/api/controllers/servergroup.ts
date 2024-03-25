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
  DelteAllServergroupsSchema,
  EditServergroupSchema,
} from "../../../types/apiBody";
import { SingleError } from "../../../types/error";
import { clientMapper } from "../mapper/clientMapper";
import servergroupMapper from "../mapper/servergroupMapper";
import { getDbClient } from "../utility/getTeamspeakClient";
import restrictedNext from "../utility/restrictedNext";

const servergroup = (teamspeak: TeamSpeak) => {
  const getAllServergroups: RequestHandler = async (req, res, next) => {
    let servergroupList: TeamSpeakServerGroup[];
    try {
      servergroupList = await teamspeak.serverGroupList();
    } catch (error) {
      return restrictedNext(next, new UnkownTeamspeakError());
    }

    const mappedServergroupList = servergroupList.map(servergroupMapper);

    res.json(mappedServergroupList);
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

    res.json(mappedServergroup);
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

    res.json(mappedClients);
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

    const errors: SingleError[] = [];
    await Promise.all(
      servergroups.map(async (servergroup) => {
        try {
          await teamspeak.clientAddServerGroup(
            dbClient.clientDatabaseId,
            servergroup
          );
        } catch (error) {
          if (!(error instanceof ResponseError)) {
            return errors.push(new UnkownTeamspeakError());
          }

          switch (error.msg) {
            case "invalid group ID":
              errors.push(
                new ServergroupDoesNotExistError("servergroup", servergroup)
              );
              break;

            case "duplicate entry":
              errors.push(
                new ServergroupDuplicateEntry("servergroup", servergroup)
              );
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

    const errors: SingleError[] = [];
    await Promise.all(
      servergroups.map(async (servergroup) => {
        try {
          await teamspeak.clientDelServerGroup(
            dbClient.clientDatabaseId,
            servergroup
          );
        } catch (error) {
          if (!(error instanceof ResponseError)) {
            return errors.push(new UnkownTeamspeakError());
          }

          switch (error.msg) {
            case "invalid group ID":
              errors.push(
                new ServergroupDoesNotExistError("servergroup", servergroup)
              );
              break;

            case "empty result set":
              errors.push(
                new ServergroupEmptyResult("servergroup", servergroup)
              );
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

    res.json({ message: "Succesfull removed servergroups!" });
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

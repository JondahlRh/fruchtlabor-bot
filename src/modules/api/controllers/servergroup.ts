import { RequestHandler } from "express";
import {
  ResponseError,
  TeamSpeak,
  TeamSpeakServerGroup,
} from "ts3-nodejs-library";
import { ServerGroupClientEntry } from "ts3-nodejs-library/lib/types/ResponseTypes";

import ClientDoesNotExistError from "../../../classes/htmlErrors/ClientDoesNotExistError";
import PartialError from "../../../classes/htmlErrors/PartialError";
import RequestBodyError from "../../../classes/htmlErrors/RequestBodyError";
import ServergroupDoesNotExistError from "../../../classes/htmlErrors/ServergroupDoesNotExistError";
import ServergroupDuplicateEntry from "../../../classes/htmlErrors/ServergroupDuplicateEntry";
import ServergroupEmptyResult from "../../../classes/htmlErrors/ServergroupEmptyResult";
import UnkownTeamspeakError from "../../../classes/htmlErrors/UnkownTeamspeakError";
import { EditServergroupSchema, ParamIdSchema } from "../../../types/apiBody";
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
    const requestParam = ParamIdSchema.safeParse(req.params.id);

    if (!requestParam.success) {
      return restrictedNext(
        next,
        new RequestBodyError(requestParam.error.message)
      );
    }

    const id = requestParam.data;

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
    const requestParam = ParamIdSchema.safeParse(req.params.id);

    if (!requestParam.success) {
      return restrictedNext(
        next,
        new RequestBodyError(requestParam.error.message)
      );
    }

    const id = requestParam.data;

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

  const postServergroup: RequestHandler = async (req, res, next) => {
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

  return {
    getAllServergroups,
    getSingleServergroup,
    getClientsOfServergroup,
    postServergroup,
    deleteServergroup,
  };
};

export default servergroup;

import { RequestHandler } from "express";
import {
  ResponseError,
  TeamSpeak,
  TeamSpeakServerGroup,
} from "ts3-nodejs-library";
import {
  ClientDBInfo,
  ServerGroupClientEntry,
} from "ts3-nodejs-library/lib/types/ResponseTypes";

import ApiErrorCodes from "../enums/ApiErrorCodes";
import clientMapper, { MappedClient } from "../mapper/clientMapper";
import servergroupMapper from "../mapper/servergroupMapper";
import { SingleError } from "../types/errors";
import restrictedNext from "../utility/restrictedNext";

const servergroup = (teamspeak: TeamSpeak) => {
  const getAllServergroups: RequestHandler = async (req, res, next) => {
    let servergroupList: TeamSpeakServerGroup[];
    try {
      servergroupList = await teamspeak.serverGroupList();
    } catch (error) {
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.UNKOWN_TEAMSPEAK_ERROR,
      });
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
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.UNKOWN_TEAMSPEAK_ERROR,
      });
    }

    if (servergroup === undefined) {
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.SERVERGROUP_DOES_NOT_EXIST,
        field: { key: "id", value: id },
      });
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
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.UNKOWN_TEAMSPEAK_ERROR,
      });
    }

    if (servergroup === undefined) {
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.SERVERGROUP_DOES_NOT_EXIST,
        field: { key: "id", value: id },
      });
    }

    let servergroupClientList: ServerGroupClientEntry[];
    try {
      servergroupClientList = await servergroup.clientList();
    } catch (error) {
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.UNKOWN_TEAMSPEAK_ERROR,
      });
    }

    const mappedClients: MappedClient[] = [];

    for (const sgClient of servergroupClientList) {
      let client: ClientDBInfo[];

      try {
        client = await teamspeak.clientDbInfo(sgClient.cldbid);
      } catch (error) {
        return restrictedNext(next, {
          errorCode: ApiErrorCodes.UNKOWN_TEAMSPEAK_ERROR,
        });
      }

      if (client.length === 0) continue;

      mappedClients.push(clientMapper(client[0]));
    }

    res.json(mappedClients);
  };

  const postServergroup: RequestHandler = async (req, res, next) => {
    const client: string = req.body.client;
    const servergroups: string[] = req.body.servergroups;

    if (typeof client !== "string") {
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.WRONG_TYPE,
        field: { key: "client", value: client, requiredType: "string" },
      });
    }

    if (
      !Array.isArray(servergroups) ||
      servergroups.some((x) => typeof x !== "string")
    ) {
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.WRONG_TYPE,
        field: {
          key: "servergroups",
          value: servergroups,
          requiredType: "string[]",
        },
      });
    }

    let dbId = client;
    try {
      const clientDbFind = await teamspeak.clientDbFind(client, true);
      dbId = clientDbFind[0].cldbid;
    } catch (error) {}

    const errors: SingleError[] = [];
    await Promise.all(
      servergroups.map(async (servergroup) => {
        try {
          await teamspeak.clientAddServerGroup(dbId, servergroup);
        } catch (error) {
          if (!(error instanceof ResponseError)) {
            return errors.push({
              errorCode: ApiErrorCodes.UNKOWN_TEAMSPEAK_ERROR,
            });
          }

          switch (error.msg) {
            case "invalid group ID":
              errors.push({
                errorCode: ApiErrorCodes.SERVERGROUP_DOES_NOT_EXIST,
                field: { key: "servergroup", value: servergroup },
              });
              break;

            case "duplicate entry":
              errors.push({
                errorCode: ApiErrorCodes.SERVERGROUP_DUPLICATE_ENTRY,
                field: { key: "servergroup", value: servergroup },
              });
              break;

            default:
              errors.push({ errorCode: ApiErrorCodes.UNKOWN_TEAMSPEAK_ERROR });
              break;
          }
        }
      })
    );

    if (errors.length > 0) {
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.PARTIAL_ERROR,
        errors,
      });
    }

    res.json({ message: "Succesfull added servergroups!" });
  };

  const deleteServergroup: RequestHandler = async (req, res, next) => {
    const client: string = req.body.client;
    const servergroups: string[] = req.body.servergroups;

    if (typeof client !== "string") {
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.WRONG_TYPE,
        field: { key: "client", value: client, requiredType: "string" },
      });
    }

    if (
      !Array.isArray(servergroups) ||
      servergroups.some((x) => typeof x !== "string")
    ) {
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.WRONG_TYPE,
        field: {
          key: "servergroups",
          value: servergroups,
          requiredType: "string[]",
        },
      });
    }

    let dbId = client;
    try {
      const clientDbFind = await teamspeak.clientDbFind(client, true);
      dbId = clientDbFind[0].cldbid;
    } catch (error) {}

    const errors: SingleError[] = [];
    await Promise.all(
      servergroups.map(async (servergroup) => {
        try {
          await teamspeak.clientDelServerGroup(dbId, servergroup);
        } catch (error) {
          if (!(error instanceof ResponseError)) {
            return errors.push({
              errorCode: ApiErrorCodes.UNKOWN_TEAMSPEAK_ERROR,
            });
          }

          switch (error.msg) {
            case "invalid group ID":
              errors.push({
                errorCode: ApiErrorCodes.SERVERGROUP_DOES_NOT_EXIST,
                field: { key: "servergroup", value: servergroup },
              });
              break;

            case "empty result set":
              errors.push({
                errorCode: ApiErrorCodes.SERVERGROUP_EMPTY_RESULT,
                field: { key: "servergroup", value: servergroup },
              });
              break;

            default:
              errors.push({ errorCode: ApiErrorCodes.UNKOWN_TEAMSPEAK_ERROR });
              break;
          }
        }
      })
    );

    if (errors.length > 0) {
      return restrictedNext(next, {
        errorCode: ApiErrorCodes.PARTIAL_ERROR,
        errors,
      });
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

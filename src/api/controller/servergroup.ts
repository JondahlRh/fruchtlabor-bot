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

import clientMapper, { MappedClient } from "../mapper/clientMapper";
import servergroupMapper from "../mapper/servergroupMapper";
import { HtmlError } from "../utility/HtmlError";

const servergroup = (teamspeak: TeamSpeak) => {
  const getAllServergroups: RequestHandler = async (req, res, next) => {
    let servergroupList: TeamSpeakServerGroup[];
    try {
      servergroupList = await teamspeak.serverGroupList();
    } catch (error) {
      return next(
        new HtmlError("Unkown teamspeak error!", 500, "UNKOWN_TEAMSPEAK_ERROR")
      );
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
      return next(
        new HtmlError("Unkown teamspeak error!", 500, "UNKOWN_TEAMSPEAK_ERROR")
      );
    }

    if (servergroup === undefined) {
      return next(
        new HtmlError(
          "Servergroup id does not exist!",
          400,
          "UNKOWN_SERVERGROUPID"
        )
      );
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
      return next(
        new HtmlError("Unkown teamspeak error!", 500, "UNKOWN_TEAMSPEAK_ERROR")
      );
    }

    if (servergroup === undefined) {
      return next(
        new HtmlError(
          "Servergroup id does not exist!",
          400,
          "UNKOWN_SERVERGROUPID"
        )
      );
    }

    let servergroupClientList: ServerGroupClientEntry[];
    try {
      servergroupClientList = await servergroup.clientList();
    } catch (error) {
      return next(
        new HtmlError("Unkown teamspeak error!", 500, "UNKOWN_TEAMSPEAK_ERROR")
      );
    }

    const mappedClients: MappedClient[] = [];

    for (const sgClient of servergroupClientList) {
      let client: ClientDBInfo[];

      try {
        client = await teamspeak.clientDbInfo(sgClient.cldbid);
      } catch (error) {
        return next(
          new HtmlError(
            "Unkown teamspeak error!",
            500,
            "UNKOWN_TEAMSPEAK_ERROR"
          )
        );
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
      return next(
        new HtmlError("Client must be of type string!", 400, "TYPE_ERROR")
      );
    }

    if (
      !Array.isArray(servergroups) ||
      servergroups.some((x) => typeof x !== "string")
    ) {
      return next(
        new HtmlError(
          "Servergroups must be an array of strings!",
          400,
          "TYPE_ERROR"
        )
      );
    }

    let dbId = client;
    try {
      const clientDbFind = await teamspeak.clientDbFind(client, true);
      dbId = clientDbFind[0].cldbid;
    } catch (error) {}

    let successes = 0;
    const errors: string[] = [];
    await Promise.all(
      servergroups.map(async (servergroup) => {
        try {
          await teamspeak.clientAddServerGroup(dbId, servergroup);
          successes++;
        } catch (error) {
          // TODO: Error Handling to seperate function

          if (!(error instanceof ResponseError)) {
            return errors.push("Unkown teamspeak error!");
          }

          switch (error.msg) {
            case "invalid group ID":
              errors.push(`Servergroup ${servergroup} doenst exist!`);
              break;

            case "duplicate entry":
              errors.push(
                `Servergroup ${servergroup} already present in client!`
              );
              break;

            default:
              errors.push("Unkown teamspeak error!");
              break;
          }
        }
      })
    );

    if (successes > 0 && errors.length > 0) {
      return res.json({
        message: "Partially added servergroups with following errors!",
        errors,
      });
    }

    if (errors.length > 0) {
      return res.json({
        message: "Adding servergroups failed with following errors!",
        errors,
      });
    }

    res.json({ message: "Succesfull added servergroups!" });
  };

  const deleteServergroup: RequestHandler = async (req, res, next) => {
    const client: string = req.body.client;
    const servergroups: string[] = req.body.servergroups;

    if (typeof client !== "string") {
      return next(
        new HtmlError("Client must be of type string!", 400, "TYPE_ERROR")
      );
    }

    if (
      !Array.isArray(servergroups) ||
      servergroups.some((x) => typeof x !== "string")
    ) {
      return next(
        new HtmlError(
          "Servergroups must be an array of strings!",
          400,
          "TYPE_ERROR"
        )
      );
    }

    let dbId = client;
    try {
      const clientDbFind = await teamspeak.clientDbFind(client, true);
      dbId = clientDbFind[0].cldbid;
    } catch (error) {}

    let successes = 0;
    const errors: string[] = [];
    await Promise.all(
      servergroups.map(async (servergroup) => {
        try {
          await teamspeak.clientDelServerGroup(dbId, servergroup);
          successes++;
        } catch (error) {
          // TODO: Error Handling to seperate function

          if (!(error instanceof ResponseError)) {
            return errors.push("Unkown teamspeak error!");
          }

          switch (error.msg) {
            case "invalid group ID":
              errors.push(`Servergroup ${servergroup} doenst exist!`);
              break;

            case "empty result set":
              errors.push(`Servergroup ${servergroup} not present in client!`);
              break;

            default:
              errors.push("Unkown teamspeak error!");
              break;
          }
        }
      })
    );

    if (successes > 0 && errors.length > 0) {
      return res.json({
        message: "Partially removed servergroups with following errors!",
        errors,
      });
    }

    if (errors.length > 0) {
      return res.json({
        message: "Removing servergroups failed with following errors!",
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

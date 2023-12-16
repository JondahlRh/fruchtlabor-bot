import { Request, Response, NextFunction } from "express";
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
  const getAllServergroups = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
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

  const getSingleServergroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
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

  const getClientsOfServergroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
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

  const postServergroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { client, servergroupId } = req.body;

    if (typeof client !== "string" && typeof client !== "number") {
      return next(
        new HtmlError(
          "Client must be of type string or number",
          400,
          "WRONG_TYPE"
        )
      );
    }

    if (
      typeof servergroupId !== "string" &&
      typeof servergroupId !== "number"
    ) {
      return next(
        new HtmlError(
          "ServergroupId must be of type string or number",
          400,
          "WRONG_TYPE"
        )
      );
    }

    let dbId = String(client);
    try {
      const clientDbFind = await teamspeak.clientDbFind(String(client), true);
      dbId = clientDbFind[0].cldbid;
    } catch (error) {}

    try {
      await teamspeak.serverGroupAddClient(dbId, String(servergroupId));
    } catch (error) {
      if (error instanceof ResponseError && error.msg === "duplicate entry") {
        return next(
          new HtmlError("Servergroup already asigned", 400, "DUPLICATE_ENTRY")
        );
      }

      return next(
        new HtmlError("Unkown teamspeak error!", 500, "UNKOWN_TEAMSPEAK_ERROR")
      );
    }

    res.json({ message: "Servergroup asigend!" });
  };

  return {
    getAllServergroups,
    getSingleServergroup,
    getClientsOfServergroup,
    postServergroup,
  };
};

export default servergroup;

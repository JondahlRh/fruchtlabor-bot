import { Request, Response, NextFunction } from "express";
import { TeamSpeak, TeamSpeakServerGroup } from "ts3-nodejs-library";
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

  return { getAllServergroups, getSingleServergroup, getClientsOfServergroup };
};

export default servergroup;

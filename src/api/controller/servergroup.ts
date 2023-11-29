import { Request, Response, NextFunction } from "express";
import { TeamSpeak } from "ts3-nodejs-library";

import clientMapper, { MappedClient } from "../mapper/clientMapper";
import servergroupMapper from "../mapper/servergroupMapper";
import { HtmlError } from "../utility/HtmlError";

const servergroup = (teamspeak: TeamSpeak) => {
  const getAllServergroups = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const servergroupList = await teamspeak.serverGroupList();

    const mappedServergroupList = servergroupList.map(servergroupMapper);

    res.json(mappedServergroupList);
  };

  const getSingleServergroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const servergroup = await teamspeak.getServerGroupById(id);
    if (servergroup === undefined) {
      return next(
        new HtmlError(
          "Servergroup id does not exist!",
          400,
          "SERVERGROUP_ID_UNKOWN"
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

    const servergroup = await teamspeak.getServerGroupById(id);
    if (servergroup === undefined) {
      return next(
        new HtmlError(
          "Servergroup id does not exist!",
          400,
          "SERVERGROUP_ID_UNKOWN"
        )
      );
    }

    const servergroupClientList = await servergroup.clientList();

    const mappedClients: MappedClient[] = [];

    for (const sgClient of servergroupClientList) {
      const client = await teamspeak.clientDbInfo(sgClient.cldbid);
      if (client.length === 0) continue;

      mappedClients.push(clientMapper(client[0]));
    }

    res.json(mappedClients);
  };

  return { getAllServergroups, getSingleServergroup, getClientsOfServergroup };
};

export default servergroup;

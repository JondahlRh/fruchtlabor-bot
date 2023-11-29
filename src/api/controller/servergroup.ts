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
    const serverGroupList = await teamspeak.serverGroupList();

    const mappedServerGroupList = serverGroupList.map(servergroupMapper);

    res.json(mappedServerGroupList);
  };

  const getSingleServergroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const serverGroup = await teamspeak.getServerGroupById(id);
    if (serverGroup === undefined) {
      return next(
        new HtmlError(
          "Servergroup id does not exist!",
          400,
          "SERVERGROUP_ID_UNKOWN"
        )
      );
    }

    const mappedServerGroup = servergroupMapper(serverGroup);

    res.json(mappedServerGroup);
  };

  const getClientsOfServergroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const serverGroup = await teamspeak.getServerGroupById(id);
    if (serverGroup === undefined) {
      return next(
        new HtmlError(
          "Servergroup id does not exist!",
          400,
          "SERVERGROUP_ID_UNKOWN"
        )
      );
    }

    const serverGroupClientList = await serverGroup.clientList();

    const mappedClients: MappedClient[] = [];

    for (const sgClient of serverGroupClientList) {
      const client = await teamspeak.clientDbInfo(sgClient.cldbid);
      if (client.length === 0) continue;

      mappedClients.push(clientMapper(client[0]));
    }

    res.json(mappedClients);
  };

  return { getAllServergroups, getSingleServergroup, getClientsOfServergroup };
};

export default servergroup;

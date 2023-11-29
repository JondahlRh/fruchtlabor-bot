import { Request, Response, NextFunction } from "express";
import { TeamSpeak } from "ts3-nodejs-library";

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

  return { getAllServergroups, getSingleServergroup };
};

export default servergroup;

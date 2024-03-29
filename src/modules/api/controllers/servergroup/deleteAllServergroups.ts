import {
  IdError,
  RequestBodyError,
  UnkownTeamSpeakError,
} from "classes/htmlErrors";
import DeleteAllServergroupsResponse from "classes/htmlSuccesses/DeleteAllServergroupsResponse";
import { RequestHandler } from "express";
import DelteAllServergroupsSchema from "modules/api/schemas/DelteAllServergroupsSchema";
import { getDbClient } from "modules/api/utility/getTeamspeakClient";
import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";
import { TeamSpeak } from "ts3-nodejs-library";
import { fromZodError } from "zod-validation-error";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    const requestBody = DelteAllServergroupsSchema.safeParse(req.body);

    if (!requestBody.success) {
      return restrictedNext(
        next,
        new RequestBodyError(fromZodError(requestBody.error).toString())
      );
    }

    const { client } = requestBody.data;

    const dbClient = await getDbClient(teamspeak, client);
    if (dbClient === null) {
      return restrictedNext(next, new IdError(client));
    }

    let servergroups: string[];
    try {
      const serverGroupsByClientId = await teamspeak.serverGroupsByClientId(
        dbClient.clientDatabaseId
      );

      servergroups = serverGroupsByClientId.map((x) => x.sgid);
    } catch (error) {
      return restrictedNext(next, new UnkownTeamSpeakError());
    }

    try {
      await teamspeak.clientDelServerGroup(
        dbClient.clientDatabaseId,
        servergroups
      );
    } catch (error) {
      return restrictedNext(next, new UnkownTeamSpeakError());
    }

    restrictedResponse(res, new DeleteAllServergroupsResponse());
  };
};

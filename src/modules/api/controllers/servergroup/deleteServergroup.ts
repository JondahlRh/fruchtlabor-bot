import { RequestHandler } from "express";
import { ResponseError, TeamSpeak } from "ts3-nodejs-library";
import { fromZodError } from "zod-validation-error";

import { IdError, RequestBodyError } from "classes/htmlErrors";
import PartialSuccessResponse, {
  PartialEmptyError,
  PartialIdError,
  PartialResponse,
  PartialUnknownTeamspeakError,
} from "classes/partial";
import PartialSuccess from "classes/partial/PartialSuccess";

import EditServergroupSchema from "modules/api/schemas/EditGroupSchema";
import { getDbClient } from "modules/api/utility/getTeamspeakClient";
import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    const requestBody = EditServergroupSchema.safeParse(req.body);

    if (!requestBody.success) {
      return restrictedNext(
        next,
        new RequestBodyError(fromZodError(requestBody.error).toString())
      );
    }

    const { client, servergroups } = requestBody.data;

    const dbClient = await getDbClient(teamspeak, client);
    if (dbClient === null) {
      return restrictedNext(next, new IdError(client));
    }

    const partialResponses: PartialResponse[] = [];
    await Promise.all(
      servergroups.map(async (servergroup) => {
        try {
          await teamspeak.clientDelServerGroup(
            dbClient.clientDatabaseId,
            servergroup
          );
          partialResponses.push(new PartialSuccess(servergroup));
        } catch (error) {
          if (!(error instanceof ResponseError)) {
            partialResponses.push(
              new PartialUnknownTeamspeakError(servergroup)
            );
            return;
          }

          switch (error.msg) {
            case "invalid group ID":
              partialResponses.push(new PartialIdError(servergroup));
              return;

            case "empty result set":
              partialResponses.push(new PartialEmptyError(servergroup));
              return;

            default:
              partialResponses.push(
                new PartialUnknownTeamspeakError(servergroup)
              );
              return;
          }
        }
      })
    );

    restrictedResponse(res, new PartialSuccessResponse(partialResponses));
  };
};

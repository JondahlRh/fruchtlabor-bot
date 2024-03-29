import { IdError, RequestBodyError } from "classes/htmlErrors";
import PartialSuccessResponse, {
  PartialDuplicateError,
  PartialIdError,
  PartialResponse,
  PartialUnkownTeamspeakError,
} from "classes/partial";
import PartialSuccess from "classes/partial/PartialSuccess";
import { RequestHandler } from "express";
import EditServergroupSchema from "modules/api/schemas/EditGroupSchema";
import { getDbClient } from "modules/api/utility/getTeamspeakClient";
import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";
import { ResponseError, TeamSpeak } from "ts3-nodejs-library";
import { fromZodError } from "zod-validation-error";

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
          await teamspeak.clientAddServerGroup(
            dbClient.clientDatabaseId,
            servergroup
          );
          partialResponses.push(new PartialSuccess(servergroup));
        } catch (error) {
          if (!(error instanceof ResponseError)) {
            partialResponses.push(new PartialUnkownTeamspeakError(servergroup));
            return;
          }

          switch (error.msg) {
            case "invalid group ID":
              partialResponses.push(new PartialIdError(servergroup));
              return;

            case "duplicate entry":
              partialResponses.push(new PartialDuplicateError(servergroup));
              return;

            default:
              partialResponses.push(
                new PartialUnkownTeamspeakError(servergroup)
              );
              return;
          }
        }
      })
    );

    restrictedResponse(res, new PartialSuccessResponse(partialResponses));
  };
};

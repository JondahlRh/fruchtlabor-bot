import { RequestHandler } from "express";
import { TeamSpeak } from "ts3-nodejs-library";
import { fromZodError } from "zod-validation-error";

import { IdError, RequestBodyError } from "../../../../classes/htmlErrors";
import PostBanResponse from "../../../../classes/htmlSuccesses/PostBanResponse";
import PostBanClientSchema from "../../schemas/PostBanClientSchema";
import { getDbClient } from "../../utility/getTeamspeakClient";
import restrictedNext from "../../utility/restrictedNext";
import restrictedResponse from "../../utility/restrictedResponse";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    const requestBody = PostBanClientSchema.safeParse(req.body);

    if (!requestBody.success) {
      return restrictedNext(
        next,
        new RequestBodyError(fromZodError(requestBody.error).toString())
      );
    }

    const { client, banreason } = requestBody.data;

    const dbClient = await getDbClient(teamspeak, client);
    if (dbClient === null) {
      return restrictedNext(next, new IdError(client));
    }

    let ipBanId: string | null = null;
    try {
      const ipBann = await teamspeak.ban({
        ip: dbClient.clientLastip,
        banreason,
      });
      ipBanId = ipBann.banid;
    } catch (error) {}

    let tsidBanId: string | null = null;
    try {
      const tsidBann = await teamspeak.ban({
        uid: dbClient.clientUniqueIdentifier,
        banreason,
      });
      tsidBanId = tsidBann.banid;
    } catch (error) {}

    restrictedResponse(res, new PostBanResponse(ipBanId, tsidBanId));
  };
};

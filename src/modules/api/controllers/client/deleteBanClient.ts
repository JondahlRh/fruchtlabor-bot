import { RequestHandler } from "express";
import { ResponseError, TeamSpeak } from "ts3-nodejs-library";
import { fromZodError } from "zod-validation-error";

import { RequestBodyError } from "classes/htmlErrors";
import PartialSuccessResponse, {
  PartialIdError,
  PartialResponse,
  PartialUnknownTeamspeakError,
} from "classes/partial";
import PartialSuccess from "classes/partial/PartialSuccess";

import DelteBanClientSchema from "modules/api/schemas/DelteBanClientSchema";
import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    const requestBody = DelteBanClientSchema.safeParse(req.body);

    if (!requestBody.success) {
      return restrictedNext(
        next,
        new RequestBodyError(fromZodError(requestBody.error).toString())
      );
    }

    const { banids } = requestBody.data;

    const partialResponses: PartialResponse[] = [];
    await Promise.all(
      banids.map(async (banid) => {
        try {
          await teamspeak.banDel(banid);
          partialResponses.push(new PartialSuccess(banid));
          return;
        } catch (error) {
          if (!(error instanceof ResponseError)) {
            partialResponses.push(new PartialUnknownTeamspeakError(banid));
            return;
          }

          switch (error.msg) {
            case "invalid ban id":
              partialResponses.push(new PartialIdError(banid));
              return;

            default:
              partialResponses.push(new PartialUnknownTeamspeakError(banid));
              return;
          }
        }
      })
    );

    restrictedResponse(res, new PartialSuccessResponse(partialResponses));
  };
};

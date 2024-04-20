import { RequestHandler } from "express";
import { ResponseError, TeamSpeak } from "ts3-nodejs-library";
import { BanEntry } from "ts3-nodejs-library/lib/types/ResponseTypes";

import {
  IdError,
  RequestParamIdError,
  UnknownTeamSpeakError,
} from "classes/htmlErrors";
import SingleDataResponse from "classes/htmlSuccesses/SingleDataResponse";

import banMapper from "modules/api/mapper/banMapper";
import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    const id = req.params.id;

    if (!id) {
      return restrictedNext(next, new RequestParamIdError());
    }

    let banList: BanEntry[];
    try {
      banList = await teamspeak.banList();
    } catch (error) {
      if (!(error instanceof ResponseError)) {
        return restrictedNext(next, new UnknownTeamSpeakError());
      }

      switch (error.msg) {
        case "database empty result set":
          banList = [];
          break;

        default:
          return restrictedNext(next, new UnknownTeamSpeakError());
      }
    }

    const singleBan = banList.find((x) => x.banid === id);
    if (singleBan === undefined) {
      return restrictedNext(next, new IdError(id));
    }

    const mappedBan = banMapper(singleBan);

    restrictedResponse(res, new SingleDataResponse(mappedBan));
  };
};

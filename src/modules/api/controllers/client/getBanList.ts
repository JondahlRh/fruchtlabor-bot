import { RequestHandler } from "express";
import { ResponseError, TeamSpeak } from "ts3-nodejs-library";
import { BanEntry } from "ts3-nodejs-library/lib/types/ResponseTypes";

import { UnkownTeamSpeakError } from "../../../../classes/htmlErrors";
import ListDataResponse from "../../../../classes/htmlSuccesses/ListDataResponse";
import banMapper from "../../mapper/banMapper";
import restrictedNext from "../../utility/restrictedNext";
import restrictedResponse from "../../utility/restrictedResponse";

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    let banList: BanEntry[];
    try {
      banList = await teamspeak.banList();
    } catch (error) {
      if (!(error instanceof ResponseError)) {
        return restrictedNext(next, new UnkownTeamSpeakError());
      }

      switch (error.msg) {
        case "database empty result set":
          banList = [];
          break;

        default:
          return restrictedNext(next, new UnkownTeamSpeakError());
      }
    }

    const mappedBanList = banList.map(banMapper);

    restrictedResponse(res, new ListDataResponse(mappedBanList));
  };
};

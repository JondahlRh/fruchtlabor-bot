import { RequestHandler } from "express";
import { TeamSpeak } from "ts3-nodejs-library";
import { z } from "zod";

import { RequestBodyError, UnknownTeamSpeakError } from "classes/htmlErrors";
import SingleDataResponse from "classes/htmlSuccesses/SingleDataResponse";

import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";
import { singleInfoDescription } from "modules/bot/controllers/description/info";

import { findByIdTsChannel } from "services/mongodbServices/teamspeak/tsChannel";

const LinkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

const EntrySchema = z.object({
  type: z.union([
    z.literal("linkOnly"),
    z.literal("hereLabel"),
    z.literal("table"),
  ]),
  title: z.string(),
  subtitle: z.string().optional(),
  links: z.array(LinkSchema),
});

const RequestBodySchema = z.object({
  _id: z.string(),
  name: z.string(),
  channel: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  entrySections: z.array(z.array(EntrySchema)),
});

export default (teamspeak: TeamSpeak): RequestHandler => {
  return async (req, res, next) => {
    const parsedBody = RequestBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      return restrictedNext(next, new RequestBodyError(parsedBody.error));
    }

    const tsChannel = await findByIdTsChannel(parsedBody.data.channel);
    if (!tsChannel) {
      return restrictedNext(next, new UnknownTeamSpeakError());
    }

    const infoDescription = {
      ...parsedBody.data,
      channel: tsChannel,
    };

    try {
      await singleInfoDescription(teamspeak, infoDescription);
    } catch (error) {
      return restrictedNext(next, new UnknownTeamSpeakError());
    }

    restrictedResponse(res, new SingleDataResponse(true));
  };
};

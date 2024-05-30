import { Schema, Types, model } from "mongoose";
import { z } from "zod";

import TsChannel, { TsChannelZodSchema } from "models/teamspeak/TsChannel";

const LinkZodSchema = z.object({
  url: z.string(),
  label: z.string(),
});

const NewsZodSchema = z.object({
  title: z.string(),
  link: LinkZodSchema,
});

const BlackboardChannelZodSchema = z.object({
  channel: TsChannelZodSchema,
  title: z.string(),
  body: z.string(),
  news: z.array(NewsZodSchema),
  generals: z.array(NewsZodSchema),
});

type BlackboardChannelType = z.infer<typeof BlackboardChannelZodSchema>;

const LinkSchema = {
  url: { type: String, required: true },
  label: { type: String, required: true },
};

const NewsSchema = {
  title: { type: String, required: true },
  link: LinkSchema,
};

const BlackboardChannelSchema = new Schema<BlackboardChannelType>({
  channel: { type: Types.ObjectId, ref: TsChannel, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  news: [NewsSchema],
  generals: [NewsSchema],
});

export default model<BlackboardChannelType>(
  "BlackboardChannel",
  BlackboardChannelSchema
);

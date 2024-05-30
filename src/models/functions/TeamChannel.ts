import { Schema, Types, model } from "mongoose";
import { z } from "zod";

import TsChannel, { TsChannelZodSchema } from "models/teamspeak/TsChannel";

const TeamChannelZodSchema = z.object({
  channel: TsChannelZodSchema,
  name: z.string(),
  type: z.string(),
  extraBody: z.string(),
  links: z.array(
    z.object({
      label: z.string(),
      link: z.string(),
    })
  ),
  players: z.array(z.string()),
  standins: z.array(z.string()),
  trainingTimes: z.array(z.string()),
});

type TeamChannelType = z.infer<typeof TeamChannelZodSchema>;

const TeamChannelSchema = new Schema<TeamChannelType>({
  channel: { type: Types.ObjectId, ref: TsChannel, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  extraBody: { type: String, default: "" },
  links: [
    {
      label: { type: String, required: true },
      link: { type: String, required: true },
    },
  ],
  players: [{ type: String }],
  standins: [{ type: String }],
  trainingTimes: [{ type: String }],
});

export default model<TeamChannelType>("TeamChannel", TeamChannelSchema);

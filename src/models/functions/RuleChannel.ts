import { Schema, Types, model } from "mongoose";
import { z } from "zod";

import TsChannel, { TsChannelZodSchema } from "models/teamspeak/TsChannel";

const RuleChannelZodSchema = z.object({
  channel: TsChannelZodSchema,
});

type RuleChannelType = z.infer<typeof RuleChannelZodSchema>;

const RuleChannelSchema = new Schema<RuleChannelType>({
  channel: { type: Types.ObjectId, ref: TsChannel, required: true },
});

export default model<RuleChannelType>("RuleChannel", RuleChannelSchema);

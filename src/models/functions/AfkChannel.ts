import mongoose from "mongoose";
import { z } from "zod";

import TsChannel, { TsChannelZodSchema } from "models/teamspeak/TsChannel";
import TsCollection, {
  TsCollectionZodSchema,
} from "models/teamspeak/TsCollection";

const AfkChannelConditionsZodSchema = z.object({
  general: z.number(),
  micMuted: z.number(),
  sndMuted: z.number(),
});

export const AfkChannelZodSchema = z.object({
  isDefault: z.boolean(),
  moveChannel: z.object({
    member: TsChannelZodSchema,
    teammember: TsChannelZodSchema,
  }),
  apply: z.array(TsCollectionZodSchema),
  ignore: z.array(TsCollectionZodSchema),
  conditions: AfkChannelConditionsZodSchema,
});

export type AfkChannelType = z.infer<typeof AfkChannelZodSchema>;
export type AfkChannelConditionsType = z.infer<
  typeof AfkChannelConditionsZodSchema
>;

const { ObjectId } = mongoose.Schema.Types;
const AfkChannelSchema = new mongoose.Schema<AfkChannelType>({
  isDefault: { type: Boolean, default: false },
  moveChannel: {
    member: { type: ObjectId, ref: TsChannel, required: true },
    teammember: { type: ObjectId, ref: TsChannel, required: true },
  },
  apply: [{ type: ObjectId, ref: TsCollection }],
  ignore: [{ type: ObjectId, ref: TsCollection }],
  conditions: {
    general: { type: Number, default: -1 },
    micMuted: { type: Number, default: -1 },
    sndMuted: { type: Number, default: -1 },
  },
});

export default mongoose.model<AfkChannelType>("AfkChannel", AfkChannelSchema);

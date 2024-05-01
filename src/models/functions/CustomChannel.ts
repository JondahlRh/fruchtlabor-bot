import mongoose from "mongoose";
import { TsPermissionZodSchema } from "types/general";
import { z } from "zod";

import TsChannel, { TsChannelZodSchema } from "models/teamspeak/TsChannel";
import TsChannelgroup, {
  TsChannelgroupZodSchema,
} from "models/teamspeak/TsChannelgroup";

export const CustomChannelZodSchema = z.object({
  channelParent: TsChannelZodSchema,
  channelGroup: TsChannelgroupZodSchema,
  prefix: z.string(),
  permissions: z.array(TsPermissionZodSchema),
});

export type CustomChannelType = z.infer<typeof CustomChannelZodSchema>;

const { ObjectId } = mongoose.Schema.Types;
const CustomChannelSchema = new mongoose.Schema<CustomChannelType>({
  channelParent: { type: ObjectId, ref: TsChannel, require: true },
  channelGroup: { type: ObjectId, ref: TsChannelgroup, require: true },
  prefix: { type: String, default: "" },
  permissions: [
    {
      key: { type: String, required: true },
      value: { type: Number, required: true },
    },
  ],
});

export default mongoose.model<CustomChannelType>(
  "CustomChannel",
  CustomChannelSchema
);

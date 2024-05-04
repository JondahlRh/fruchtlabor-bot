import mongoose from "mongoose";
import { z } from "zod";

import TsChannel, { TsChannelZodSchema } from "models/teamspeak/TsChannel";
import TsServergroup, {
  TsServergroupZodSchema,
} from "models/teamspeak/TsServergroup";

export const AddgroupChannelZodSchema = z.object({
  channel: TsChannelZodSchema,
  moveChannel: TsChannelZodSchema,
  servergroup: TsServergroupZodSchema,
  message: z.string(),
});

export type AddgroupChannelType = z.infer<typeof AddgroupChannelZodSchema>;

const { ObjectId } = mongoose.Schema.Types;
const AddgroupChannelSchema = new mongoose.Schema<AddgroupChannelType>({
  channel: { type: ObjectId, ref: TsChannel, required: true },
  moveChannel: { type: ObjectId, ref: TsChannel, required: true },
  servergroup: { type: ObjectId, ref: TsServergroup, required: true },
  message: { type: String, default: "" },
});

export default mongoose.model<AddgroupChannelType>(
  "AddgroupChannel",
  AddgroupChannelSchema
);

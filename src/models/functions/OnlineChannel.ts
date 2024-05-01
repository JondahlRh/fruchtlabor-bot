import mongoose from "mongoose";
import { z } from "zod";

import TsChannel, { TsChannelZodSchema } from "models/teamspeak/TsChannel";
import TsCollection, {
  TsCollectionZodSchema,
} from "models/teamspeak/TsCollection";
import TsServergroup, {
  TsServergroupZodSchema,
} from "models/teamspeak/TsServergroup";

export const OnlineChannelZodSchema = z.object({
  channel: TsChannelZodSchema,
  servergroups: z.array(TsServergroupZodSchema),
  title: z.string(),
  collections: z.array(TsCollectionZodSchema),
});

export type OnlineChannelType = z.infer<typeof OnlineChannelZodSchema>;

const { ObjectId } = mongoose.Schema.Types;
const OnlineChannelSchema = new mongoose.Schema<OnlineChannelType>({
  channel: { type: ObjectId, ref: TsChannel, require: true },
  servergroups: [{ type: ObjectId, ref: TsServergroup, require: true }],
  title: { type: String, require: true },
  collections: [{ type: ObjectId, ref: TsCollection }],
});

export default mongoose.model<OnlineChannelType>(
  "OnlineChannel",
  OnlineChannelSchema
);

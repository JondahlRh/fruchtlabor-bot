import mongoose from "mongoose";
import { z } from "zod";

import TsChannel, { TsChannelZodSchema } from "./TsChannel";
import TsServergroup, { TsServergroupZodSchema } from "./TsServergroup";

export const TsCollectionZodSchema = z.object({
  name: z.string(),
  label: z.string(),
  channels: z.array(TsChannelZodSchema),
  channelParents: z.array(TsChannelZodSchema),
  servergroups: z.array(TsServergroupZodSchema),
});

export type TsCollectionType = z.infer<typeof TsCollectionZodSchema>;

const { ObjectId } = mongoose.Schema.Types;
const TsCollectionSchema = new mongoose.Schema<TsCollectionType>({
  name: { type: String, required: true, unique: true },
  label: { type: String, default: "" },
  channels: [{ type: ObjectId, ref: TsChannel }],
  channelParents: [{ type: ObjectId, ref: TsChannel }],
  servergroups: [{ type: ObjectId, ref: TsServergroup }],
});

export default mongoose.model<TsCollectionType>(
  "TsCollection",
  TsCollectionSchema
);

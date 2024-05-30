import mongoose from "mongoose";

import TsChannel, { TsChannelType } from "./TsChannel";
import TsServergroup, { TsServergroupType } from "./TsServergroup";

export type TsCollectionType = {
  name: string;
  label: string;
  channels: TsChannelType[];
  channelParents: TsChannelType[];
  servergroups: TsServergroupType[];
};

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

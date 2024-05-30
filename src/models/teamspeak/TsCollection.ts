import { Schema, Types, model } from "mongoose";

import TsChannel, { TsChannelType } from "./TsChannel";
import TsServergroup, { TsServergroupType } from "./TsServergroup";

export type TsCollectionType = {
  name: string;
  label: string;
  channels: TsChannelType[];
  channelParents: TsChannelType[];
  servergroups: TsServergroupType[];
};

const TsCollectionSchema = new Schema<TsCollectionType>({
  name: { type: String, required: true, unique: true },
  label: { type: String, default: "" },
  channels: [{ type: Types.ObjectId, ref: TsChannel }],
  channelParents: [{ type: Types.ObjectId, ref: TsChannel }],
  servergroups: [{ type: Types.ObjectId, ref: TsServergroup }],
});

export default model<TsCollectionType>("TsCollection", TsCollectionSchema);

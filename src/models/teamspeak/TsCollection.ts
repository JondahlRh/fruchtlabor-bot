import mongoose, { Types } from "mongoose";

import TsChannel from "./TsChannel";
import TsServergroup from "./TsServergroup";

export type TsCollectionType = {
  name: string;
  label: string;
  channels: Types.Array<Types.ObjectId>;
  channelParents: Types.Array<Types.ObjectId>;
  servergroups: Types.Array<Types.ObjectId>;
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

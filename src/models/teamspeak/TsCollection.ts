import mongoose from "mongoose";

import TsChannel from "./TsChannel";
import TsServergroup from "./TsServergroup";

const { ObjectId } = mongoose.Schema.Types;
const TsCollectionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  label: { type: String, default: "" },
  channels: [{ type: ObjectId, ref: TsChannel }],
  channelParents: [{ type: ObjectId, ref: TsChannel }],
  servergroups: [{ type: ObjectId, ref: TsServergroup }],
});

export default mongoose.model("TsCollection", TsCollectionSchema);

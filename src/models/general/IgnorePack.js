import mongoose from "mongoose";

import TsChannel from "../teamspeak/TsChannel.js";
import TsServergroup from "../teamspeak/TsServergroup.js";

const { ObjectId } = mongoose.Schema.Types;
const IgnorePackSchema = new mongoose.Schema({
  name: { type: String, require: true },
  channels: [{ type: ObjectId, ref: TsChannel }],
  channelParents: [{ type: ObjectId, ref: TsChannel }],
  servergroups: [{ type: ObjectId, ref: TsServergroup }],
});

export default mongoose.model("IgnorePack", IgnorePackSchema);

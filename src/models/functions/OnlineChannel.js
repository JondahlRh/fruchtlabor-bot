import mongoose from "mongoose";

import TsChannel from "../teamspeak/TsChannel.js";
import TsServergroup from "../teamspeak/TsServergroup.js";

const { ObjectId } = mongoose.Schema.Types;
const OnlineChannelSchema = new mongoose.Schema({
  channel: { type: ObjectId, ref: TsChannel, require: true },
  servergroups: [{ type: ObjectId, ref: TsServergroup }],
  title: { type: String, require: true },
});

export default mongoose.model("OnlineChannel", OnlineChannelSchema);

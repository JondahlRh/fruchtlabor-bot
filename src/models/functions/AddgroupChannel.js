import mongoose from "mongoose";

import TsChannel from "../teamspeak/TsChannel.js";
import TsServergroup from "../teamspeak/TsServergroup.js";

const { ObjectId } = mongoose.Schema.Types;
const AddgroupChannelSchema = new mongoose.Schema({
  channel: { type: ObjectId, ref: TsChannel, require: true },
  moveChannel: { type: ObjectId, ref: TsChannel, require: true },
  servergroup: { type: ObjectId, ref: TsServergroup, require: true },
  message: { type: String, require: true },
});

export default mongoose.model("AddgroupChannel", AddgroupChannelSchema);

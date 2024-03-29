import TsChannel from "models/teamspeak/TsChannel";
import TsServergroup from "models/teamspeak/TsServergroup";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;
const AddgroupChannelSchema = new mongoose.Schema({
  channel: { type: ObjectId, ref: TsChannel, require: true },
  moveChannel: { type: ObjectId, ref: TsChannel, require: true },
  servergroup: { type: ObjectId, ref: TsServergroup, require: true },
  message: { type: String, default: "" },
});

export default mongoose.model("AddgroupChannel", AddgroupChannelSchema);

import TsServergroup from "models/teamspeak/TsServergroup";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;
const JoinMessageSchema = new mongoose.Schema({
  servergroup: { type: ObjectId, ref: TsServergroup, require: true },
  message: { type: String, require: true },
});

export default mongoose.model("JoinMessage", JoinMessageSchema);

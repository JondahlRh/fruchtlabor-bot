import mongoose from "mongoose";

import TsServergroup from "../teamspeak/TsServergroup";

const { ObjectId } = mongoose.Schema.Types;
const JoinMessageSchema = new mongoose.Schema({
  servergroup: { type: ObjectId, ref: TsServergroup, require: true },
  message: { type: String, require: true },
});

export default mongoose.model("JoinMessage", JoinMessageSchema);

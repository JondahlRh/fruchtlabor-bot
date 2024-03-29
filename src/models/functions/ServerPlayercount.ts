import mongoose from "mongoose";

import CsServer from "models/general/CsServer";
import TsChannel from "models/teamspeak/TsChannel";

const { ObjectId } = mongoose.Schema.Types;
const ServerPlayercountSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  channel: { type: ObjectId, ref: TsChannel, require: true },
  server: { type: ObjectId, ref: CsServer, require: true },
});

export default mongoose.model("ServerPlayercount", ServerPlayercountSchema);

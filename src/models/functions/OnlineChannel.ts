import TsChannel from "models/teamspeak/TsChannel";
import TsCollection from "models/teamspeak/TsCollection";
import TsServergroup from "models/teamspeak/TsServergroup";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;
const OnlineChannelSchema = new mongoose.Schema({
  channel: { type: ObjectId, ref: TsChannel, require: true },
  servergroups: [{ type: ObjectId, ref: TsServergroup, require: true }],
  title: { type: String, require: true },
  collections: [{ type: ObjectId, ref: TsCollection }],
});

export default mongoose.model("OnlineChannel", OnlineChannelSchema);

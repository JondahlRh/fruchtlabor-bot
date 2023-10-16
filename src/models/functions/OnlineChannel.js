import mongoose from "mongoose";

import TsChannel from "../teamspeak/TsChannel.js";
import TsCollection from "../teamspeak/TsCollection.js";
import TsServergroup from "../teamspeak/TsServergroup.js";

const { ObjectId } = mongoose.Schema.Types;
const OnlineChannelSchema = new mongoose.Schema({
  channel: { type: ObjectId, ref: TsChannel, require: true },
  servergroups: [{ type: ObjectId, ref: TsServergroup, require: true }],
  title: { type: String, require: true },
  collections: [{ type: ObjectId, ref: TsCollection, require: true }],
});

export default mongoose.model("OnlineChannel", OnlineChannelSchema);

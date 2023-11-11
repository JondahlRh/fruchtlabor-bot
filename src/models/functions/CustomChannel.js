import mongoose from "mongoose";

import TsChannel from "../teamspeak/TsChannel.js";
import TsChannelgroup from "../teamspeak/TsChannelgroup.js";

const { ObjectId } = mongoose.Schema.Types;
const CustomChannelSchema = new mongoose.Schema({
  channelParent: { type: ObjectId, ref: TsChannel, require: true },
  channelGroup: { type: ObjectId, ref: TsChannelgroup, require: true },
  prefix: { type: String, default: "" },
  permissions: [
    {
      key: { type: String, required: true },
      value: { type: Number, required: true },
    },
  ],
});

export default mongoose.model("CustomChannel", CustomChannelSchema);

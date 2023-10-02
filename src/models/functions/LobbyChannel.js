import mongoose from "mongoose";

import TsChannel from "../teamspeak/TsChannel.js";
import TsDescription from "../teamspeak/TsDescription.js";

const { ObjectId } = mongoose.Schema.Types;
const LobbyChannelSchema = new mongoose.Schema({
  channelParent: { type: ObjectId, ref: TsChannel, require: true },
  channelParentSiblings: [{ type: ObjectId, ref: TsChannel }],
  description: { type: ObjectId, ref: TsDescription },
  prefix: { type: String, default: "" },
  minimum: { type: Number, default: 2 },
  clientLimit: { type: Number, default: -1 },
  permissions: [
    {
      key: { type: String, required: true },
      value: { type: Number, required: true },
    },
  ],
});

export default mongoose.model("LobbyChannel", LobbyChannelSchema);

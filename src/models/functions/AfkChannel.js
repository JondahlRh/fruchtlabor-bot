import mongoose from "mongoose";

import IgnorePack from "../general/IgnorePack.js";
import TsChannel from "../teamspeak/TsChannel.js";

const { ObjectId } = mongoose.Schema.Types;
const AfkChannelSchema = new mongoose.Schema({
  isDefault: { type: Boolean, default: false },
  moveChannel: { type: ObjectId, ref: TsChannel, require: true },
  channels: [{ type: ObjectId, ref: TsChannel }],
  channelParents: [{ type: ObjectId, ref: TsChannel }],
  conditions: {
    general: { type: Number, default: -1 },
    micMuted: { type: Number, default: -1 },
    sndMuted: { type: Number, default: -1 },
  },
  ignore: { type: ObjectId, ref: IgnorePack, require: true },
});

export default mongoose.model("AfkChannel", AfkChannelSchema);

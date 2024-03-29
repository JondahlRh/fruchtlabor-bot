import mongoose from "mongoose";

import TsChannel from "models/teamspeak/TsChannel";
import TsCollection from "models/teamspeak/TsCollection";

const { ObjectId } = mongoose.Schema.Types;
const AfkChannelSchema = new mongoose.Schema({
  isDefault: { type: Boolean, default: false },
  moveChannel: {
    member: { type: ObjectId, ref: TsChannel, require: true },
    teammember: { type: ObjectId, ref: TsChannel, require: true },
  },
  apply: [{ type: ObjectId, ref: TsCollection }],
  ignore: [{ type: ObjectId, ref: TsCollection }],
  conditions: {
    general: { type: Number, default: -1 },
    micMuted: { type: Number, default: -1 },
    sndMuted: { type: Number, default: -1 },
  },
});

export default mongoose.model("AfkChannel", AfkChannelSchema);

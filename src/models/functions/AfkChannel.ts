import mongoose, { Types } from "mongoose";

import TsChannel from "models/teamspeak/TsChannel";
import TsCollection from "models/teamspeak/TsCollection";

export type AfkChannelType = {
  isDefault: boolean;
  moveChannel: {
    member: Types.ObjectId;
    teammember: Types.ObjectId;
  };
  apply: Types.Array<Types.ObjectId>;
  ignore: Types.Array<Types.ObjectId>;
  conditions: {
    general: number;
    micMuted: number;
    sndMuted: number;
  };
};

const { ObjectId } = mongoose.Schema.Types;
const AfkChannelSchema = new mongoose.Schema<AfkChannelType>({
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

export default mongoose.model<AfkChannelType>("AfkChannel", AfkChannelSchema);

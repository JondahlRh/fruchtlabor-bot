import mongoose from "mongoose";

import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";
import TsCollection, { TsCollectionType } from "models/teamspeak/TsCollection";

export type AfkChannelConditions = {
  general: number;
  micMuted: number;
  sndMuted: number;
};

export type AfkChannelType = {
  isDefault: boolean;
  moveChannel: {
    member: TsChannelType;
    teammember: TsChannelType;
  };
  apply: TsCollectionType[];
  ignore: TsCollectionType[];
  conditions: AfkChannelConditions;
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

import { Schema, Types, model } from "mongoose";

import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";
import TsCollection, { TsCollectionType } from "models/teamspeak/TsCollection";

export type AfkChannelConditionsType = {
  general: number;
  micMuted: number;
  sndMuted: number;
};

type AfkChannelType = {
  isDefault: boolean;
  moveChannel: {
    member: TsChannelType;
    teammember: TsChannelType;
  };
  apply: TsCollectionType[];
  ignore: TsCollectionType[];
  conditions: AfkChannelConditionsType;
};

const AfkChannelSchema = new Schema<AfkChannelType>({
  isDefault: { type: Boolean, default: false },
  moveChannel: {
    member: { type: Types.ObjectId, ref: TsChannel, required: true },
    teammember: { type: Types.ObjectId, ref: TsChannel, required: true },
  },
  apply: [{ type: Types.ObjectId, ref: TsCollection }],
  ignore: [{ type: Types.ObjectId, ref: TsCollection }],
  conditions: {
    general: { type: Number, default: -1 },
    micMuted: { type: Number, default: -1 },
    sndMuted: { type: Number, default: -1 },
  },
});

export default model<AfkChannelType>("AfkChannel", AfkChannelSchema);

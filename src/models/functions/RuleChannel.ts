import { Schema, Types, model } from "mongoose";

import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";

type RuleChannelType = {
  channel: TsChannelType;
};

const RuleChannelSchema = new Schema<RuleChannelType>({
  channel: { type: Types.ObjectId, ref: TsChannel, required: true },
});

export default model<RuleChannelType>("RuleChannel", RuleChannelSchema);

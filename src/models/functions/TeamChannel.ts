import { Schema, Types, model } from "mongoose";

import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";

import { VisibleLinkType } from "types/general";

type TeamChannelType = {
  channel: TsChannelType;
  name: string;
  type: string;
  extraBody: string;
  links: VisibleLinkType[];
  players: string[];
  standins: string[];
  trainingTimes: string[];
};

const TeamChannelSchema = new Schema<TeamChannelType>({
  channel: { type: Types.ObjectId, ref: TsChannel, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  extraBody: { type: String, default: "" },
  links: [
    {
      label: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  players: [{ type: String }],
  standins: [{ type: String }],
  trainingTimes: [{ type: String }],
});

export default model<TeamChannelType>("TeamChannel", TeamChannelSchema);

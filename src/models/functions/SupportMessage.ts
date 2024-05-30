import { Schema, Types, model } from "mongoose";

import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";
import TsCollection, { TsCollectionType } from "models/teamspeak/TsCollection";
import TsServergroup, {
  TsServergroupType,
} from "models/teamspeak/TsServergroup";

type SupportSpecialType = {
  servergroup: TsServergroupType;
  contactServergroups: TsServergroupType[];
  messagePrefix: {
    text: string;
    color: string;
  };
};

type SupportMessageType = {
  channel: TsChannelType;
  contactServergroups: TsServergroupType[];
  messageBody: string;
  ignore: TsCollectionType[];
  doNotDisturb: TsCollectionType[];
  specials: SupportSpecialType[];
};

const SpecialSchema = {
  servergroup: { type: Types.ObjectId, ref: TsServergroup, required: true },
  contactServergroups: [{ type: Types.ObjectId, ref: TsServergroup }],
  messagePrefix: {
    text: { type: String, required: true },
    color: { type: String, default: "ff4444" },
  },
};

const SupportMessageSchema = new Schema<SupportMessageType>({
  channel: { type: Types.ObjectId, ref: TsChannel, required: true },
  contactServergroups: [{ type: Types.ObjectId, ref: TsServergroup }],
  messageBody: { type: String, default: "" },
  ignore: [{ type: Types.ObjectId, ref: TsCollection }],
  doNotDisturb: [{ type: Types.ObjectId, ref: TsCollection }],
  specials: [SpecialSchema],
});

export default model<SupportMessageType>(
  "SupportMessage",
  SupportMessageSchema
);

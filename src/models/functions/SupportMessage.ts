import mongoose from "mongoose";

import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";
import TsCollection, { TsCollectionType } from "models/teamspeak/TsCollection";
import TsServergroup, {
  TsServergroupType,
} from "models/teamspeak/TsServergroup";

export type SupportSpecialType = {
  servergroup: TsServergroupType;
  contactServergroups: TsServergroupType[];
  messagePrefix: {
    text: string;
    color: string;
  };
};

export type SupportMessageType = {
  channel: TsChannelType;
  contactServergroups: TsServergroupType[];
  messageBody: string;
  ignore: TsCollectionType[];
  doNotDisturb: TsCollectionType[];
  specials: SupportSpecialType[];
};

const { ObjectId } = mongoose.Schema.Types;
const SupportMessageSchema = new mongoose.Schema<SupportMessageType>({
  channel: { type: ObjectId, ref: TsChannel, require: true },
  contactServergroups: [{ type: ObjectId, ref: TsServergroup, require: true }],
  messageBody: { type: String, default: "" },
  ignore: [{ type: ObjectId, ref: TsCollection }],
  doNotDisturb: [{ type: ObjectId, ref: TsCollection }],
  specials: [
    {
      servergroup: { type: ObjectId, ref: TsServergroup, require: true },
      contactServergroups: [
        { type: ObjectId, ref: TsServergroup, require: true },
      ],
      messagePrefix: {
        text: { type: String, require: true },
        color: { type: String, default: "ff4444" },
      },
    },
  ],
});

export default mongoose.model<SupportMessageType>(
  "SupportMessage",
  SupportMessageSchema
);

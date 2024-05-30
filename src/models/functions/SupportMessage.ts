import mongoose from "mongoose";

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

const { ObjectId } = mongoose.Schema.Types;
const SupportMessageSchema = new mongoose.Schema<SupportMessageType>({
  channel: { type: ObjectId, ref: TsChannel, required: true },
  contactServergroups: [{ type: ObjectId, ref: TsServergroup, required: true }],
  messageBody: { type: String, default: "" },
  ignore: [{ type: ObjectId, ref: TsCollection }],
  doNotDisturb: [{ type: ObjectId, ref: TsCollection }],
  specials: [
    {
      servergroup: { type: ObjectId, ref: TsServergroup, required: true },
      contactServergroups: [
        { type: ObjectId, ref: TsServergroup, required: true },
      ],
      messagePrefix: {
        text: { type: String, required: true },
        color: { type: String, default: "ff4444" },
      },
    },
  ],
});

export default mongoose.model<SupportMessageType>(
  "SupportMessage",
  SupportMessageSchema
);

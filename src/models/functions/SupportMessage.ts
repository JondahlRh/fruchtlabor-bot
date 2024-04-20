import mongoose, { Types } from "mongoose";

import TsChannel from "models/teamspeak/TsChannel";
import TsCollection from "models/teamspeak/TsCollection";
import TsServergroup from "models/teamspeak/TsServergroup";

export type SupportSpecialType = {
  servergroup: Types.ObjectId;
  contactServergroups: Types.Array<Types.ObjectId>;
  messagePrefix: {
    text: string;
    color: string;
  };
};

export type SupportMessageType = {
  channel: Types.ObjectId;
  contactServergroups: Types.Array<Types.ObjectId>;
  messageBody: string;
  ignore: Types.Array<Types.ObjectId>;
  doNotDisturb: Types.Array<Types.ObjectId>;
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

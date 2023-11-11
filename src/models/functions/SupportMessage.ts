import mongoose from "mongoose";

import TsChannel from "../teamspeak/TsChannel";
import TsCollection from "../teamspeak/TsCollection";
import TsServergroup from "../teamspeak/TsServergroup";

const { ObjectId } = mongoose.Schema.Types;
const SupportMessageSchema = new mongoose.Schema({
  channel: { type: ObjectId, ref: TsChannel, require: true },
  contactServergroups: [{ type: ObjectId, ref: TsServergroup, require: true }],
  messageBody: { type: String, default: "" },
  ignore: { type: ObjectId, ref: TsCollection, require: true },
  doNotDisturb: { type: ObjectId, ref: TsCollection, require: true },
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

export default mongoose.model("SupportMessage", SupportMessageSchema);

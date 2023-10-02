import mongoose from "mongoose";

import IgnorePack from "../general/IgnorePack.js";
import TsChannel from "../teamspeak/TsChannel.js";
import TsServergroup from "../teamspeak/TsServergroup.js";

const { ObjectId } = mongoose.Schema.Types;
const SupportMessageSchema = new mongoose.Schema({
  channel: { type: ObjectId, ref: TsChannel, require: true },
  contactServergroups: [{ type: ObjectId, ref: TsServergroup, require: true }],
  messageBody: { type: String, default: "" },
  ignore: { type: ObjectId, ref: IgnorePack, require: true },
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

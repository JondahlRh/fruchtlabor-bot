import mongoose from "mongoose";

import TsChannel from "../teamspeak/TsChannel.js";

const { ObjectId } = mongoose.Schema.Types;
const BotDefaultChannelSchema = new mongoose.Schema({
  channel: { type: ObjectId, ref: TsChannel },
});

export default mongoose.model("BotDefaultChannel", BotDefaultChannelSchema);

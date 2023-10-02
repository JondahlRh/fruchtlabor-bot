import mongoose from "mongoose";

const TsChannelSchema = new mongoose.Schema({
  channelId: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
});

export default mongoose.model("TsChannel", TsChannelSchema);

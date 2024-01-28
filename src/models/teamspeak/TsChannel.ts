import mongoose from "mongoose";

const TsChannelSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  isBotChannel: { type: Boolean, default: false },
});

export default mongoose.model("TsChannel", TsChannelSchema);

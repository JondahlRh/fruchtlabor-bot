import mongoose from "mongoose";

const TsChannelgroupSchema = new mongoose.Schema({
  channelgroupId: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
});

export default mongoose.model("TsChannelgroup", TsChannelgroupSchema);

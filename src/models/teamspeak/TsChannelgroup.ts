import mongoose from "mongoose";

const TsChannelgroupSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
});

export default mongoose.model("TsChannelgroup", TsChannelgroupSchema);

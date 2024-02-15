import mongoose from "mongoose";

const ActivityEntryDailySchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  activeTime: { type: Number, required: true },
  onlineTime: { type: Number, required: true },
});

export default mongoose.model("ActivityEntryDaily", ActivityEntryDailySchema);

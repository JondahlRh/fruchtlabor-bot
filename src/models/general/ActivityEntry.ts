import mongoose from "mongoose";

const ActivityEntrySchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true },
    activeTime: { type: Number, required: true },
    onlineTime: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ActivityEntry", ActivityEntrySchema);

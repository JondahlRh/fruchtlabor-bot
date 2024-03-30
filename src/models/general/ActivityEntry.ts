import mongoose from "mongoose";

const ActivityEntrySchema = new mongoose.Schema({
  uuid: { type: String, required: true },
  active: { type: Number, required: true },
  online: { type: Number, required: true },
});

export default mongoose.model("ActivityEntry", ActivityEntrySchema);

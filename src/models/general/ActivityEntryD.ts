import mongoose from "mongoose";

const ActivityEntryDSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true },
    active: { type: Number, required: true },
    online: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ActivityEntryD", ActivityEntryDSchema);

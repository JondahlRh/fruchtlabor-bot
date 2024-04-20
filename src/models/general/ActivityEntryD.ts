import mongoose from "mongoose";

export type ActivityEntryDType = {
  uuid: string;
  active: number;
  online: number;
};

const ActivityEntryDSchema = new mongoose.Schema<ActivityEntryDType>(
  {
    uuid: { type: String, required: true },
    active: { type: Number, required: true },
    online: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ActivityEntryDType>(
  "ActivityEntryD",
  ActivityEntryDSchema
);

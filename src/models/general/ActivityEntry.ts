import mongoose from "mongoose";

export type ActivityEntryType = {
  uuid: string;
  active: number;
  online: number;
};

const ActivityEntrySchema = new mongoose.Schema<ActivityEntryType>({
  uuid: { type: String, required: true },
  active: { type: Number, required: true },
  online: { type: Number, required: true },
});

export default mongoose.model<ActivityEntryType>(
  "ActivityEntry",
  ActivityEntrySchema
);

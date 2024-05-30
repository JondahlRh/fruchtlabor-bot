import mongoose from "mongoose";

export type TsDescriptionType = {
  text: string;
};

const TsDescriptionSchema = new mongoose.Schema<TsDescriptionType>({
  text: { type: String, required: true },
});

export default mongoose.model<TsDescriptionType>(
  "TsDescription",
  TsDescriptionSchema
);

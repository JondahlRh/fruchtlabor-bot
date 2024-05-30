import { Schema, model } from "mongoose";

export type TsDescriptionType = {
  name: string;
  text: string;
};

const TsDescriptionSchema = new Schema<TsDescriptionType>({
  name: { type: String, required: true, unique: true },
  text: { type: String, required: true },
});

export default model<TsDescriptionType>("TsDescription", TsDescriptionSchema);

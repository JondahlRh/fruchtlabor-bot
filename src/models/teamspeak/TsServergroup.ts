import { Schema, model } from "mongoose";

export type TsServergroupType = {
  id: number;
  name: string;
  description: string;
  isTeammember: boolean;
};

const TsServergroupSchema = new Schema<TsServergroupType>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  isTeammember: { type: Boolean, default: false },
});

export default model<TsServergroupType>("TsServergroup", TsServergroupSchema);

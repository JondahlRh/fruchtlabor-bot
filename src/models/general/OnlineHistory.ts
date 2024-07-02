import { Schema, model } from "mongoose";

type OnlineHistory = {
  client: string;
  type: string;
  status: string;
};

const OnlineHistorySchema = new Schema<OnlineHistory>(
  {
    client: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<OnlineHistory>("OnlineHistory", OnlineHistorySchema);

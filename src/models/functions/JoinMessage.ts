import { Schema, Types, model } from "mongoose";

import TsServergroup, {
  TsServergroupType,
} from "models/teamspeak/TsServergroup";

type JoinMessageType = {
  servergroup: TsServergroupType;
  message: string;
};

const JoinMessageSchema = new Schema<JoinMessageType>({
  servergroup: { type: Types.ObjectId, ref: TsServergroup, required: true },
  message: { type: String, required: true },
});

export default model<JoinMessageType>("JoinMessage", JoinMessageSchema);

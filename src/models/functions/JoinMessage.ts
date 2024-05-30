import mongoose from "mongoose";
import { z } from "zod";

import TsServergroup, {
  TsServergroupZodSchema,
} from "models/teamspeak/TsServergroup";

const JoinMessageZodSchema = z.object({
  servergroup: TsServergroupZodSchema,
  message: z.string(),
});

type JoinMessageType = z.infer<typeof JoinMessageZodSchema>;

const { ObjectId } = mongoose.Schema.Types;
const JoinMessageSchema = new mongoose.Schema<JoinMessageType>({
  servergroup: { type: ObjectId, ref: TsServergroup, required: true },
  message: { type: String, required: true },
});

export default mongoose.model<JoinMessageType>(
  "JoinMessage",
  JoinMessageSchema
);

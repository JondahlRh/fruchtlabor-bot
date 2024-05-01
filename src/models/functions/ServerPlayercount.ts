import mongoose from "mongoose";
import { z } from "zod";

import CsServer, { CsServerZodSchema } from "models/general/CsServer";
import TsChannel, { TsChannelZodSchema } from "models/teamspeak/TsChannel";

export const ServerPlayercountZodSchema = z.object({
  title: z.string(),
  description: z.string(),
  channel: TsChannelZodSchema,
  server: CsServerZodSchema,
});

export type ServerPlayercountType = z.infer<typeof ServerPlayercountZodSchema>;

const { ObjectId } = mongoose.Schema.Types;
const ServerPlayercountSchema = new mongoose.Schema<ServerPlayercountType>({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  channel: { type: ObjectId, ref: TsChannel, require: true },
  server: { type: ObjectId, ref: CsServer, require: true },
});

export default mongoose.model<ServerPlayercountType>(
  "ServerPlayercount",
  ServerPlayercountSchema
);

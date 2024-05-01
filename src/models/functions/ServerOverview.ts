import mongoose from "mongoose";
import { z } from "zod";

import CsServer, { CsServerZodSchema } from "models/general/CsServer";
import TsChannel, { TsChannelZodSchema } from "models/teamspeak/TsChannel";

export const ServerOverviewZodSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  channel: TsChannelZodSchema,
  servers: z.array(CsServerZodSchema),
});

export type ServerOverviewType = z.infer<typeof ServerOverviewZodSchema>;

const { ObjectId } = mongoose.Schema.Types;
const ServerOverviewSchema = new mongoose.Schema<ServerOverviewType>({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  description: { type: String, default: "" },
  channel: { type: ObjectId, ref: TsChannel, require: true },
  servers: [{ type: ObjectId, ref: CsServer, require: true }],
});

export default mongoose.model<ServerOverviewType>(
  "ServerOverview",
  ServerOverviewSchema
);

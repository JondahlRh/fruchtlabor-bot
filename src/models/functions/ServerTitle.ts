import { Schema, Types, model } from "mongoose";
import { z } from "zod";

import CsServer, { CsServerZodSchema } from "models/general/CsServer";
import TsChannel, { TsChannelZodSchema } from "models/teamspeak/TsChannel";

export const ServerTitleZodSchema = z.object({
  prefix: z.string(),
  title: z.string(),
  body: z.string(),
  channel: TsChannelZodSchema,
  server: CsServerZodSchema,
});

export type ServerTitleType = z.infer<typeof ServerTitleZodSchema>;

const ServerTitleSchema = new Schema<ServerTitleType>({
  prefix: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, default: "" },
  channel: { type: Types.ObjectId, ref: TsChannel, required: true },
  server: { type: Types.ObjectId, ref: CsServer, required: true },
});

export default model<ServerTitleType>("ServerTitle", ServerTitleSchema);

import { Schema, Types, model } from "mongoose";
import { z } from "zod";

import CsServer, { CsServerZodSchema } from "models/general/CsServer";
import TsChannel, { TsChannelZodSchema } from "models/teamspeak/TsChannel";
import TsDescription, {
  TsDescriptionZodSchema,
} from "models/teamspeak/TsDescription";

const ServerDescriptionZodSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  body: z.string(),
  channel: TsChannelZodSchema,
  servers: z.array(CsServerZodSchema),
  description: TsDescriptionZodSchema.optional(),
});

type ServerDescriptionType = z.infer<typeof ServerDescriptionZodSchema>;

const ServerDescriptionSchema = new Schema<ServerDescriptionType>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  body: { type: String, default: "" },
  channel: { type: Types.ObjectId, ref: TsChannel, required: true },
  servers: [{ type: Types.ObjectId, ref: CsServer, required: true }],
  description: { type: Types.ObjectId, ref: TsDescription },
});

export default model<ServerDescriptionType>(
  "ServerDescription",
  ServerDescriptionSchema
);

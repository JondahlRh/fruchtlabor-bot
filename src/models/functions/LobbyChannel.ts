import mongoose from "mongoose";
import { TsPermissionZodSchema } from "types/general";
import { z } from "zod";

import TsChannel, { TsChannelZodSchema } from "models/teamspeak/TsChannel";
import TsDescription, {
  TsDescriptionZodSchema,
} from "models/teamspeak/TsDescription";

export const LobbyChannelZodSchema = z.object({
  channelParent: TsChannelZodSchema,
  channelParentSiblings: z.array(TsChannelZodSchema),
  description: TsDescriptionZodSchema,
  prefix: z.string(),
  minimum: z.number(),
  clientLimit: z.number(),
  permissions: z.array(TsPermissionZodSchema),
});

export type LobbyChannelType = z.infer<typeof LobbyChannelZodSchema>;

const { ObjectId } = mongoose.Schema.Types;
const LobbyChannelSchema = new mongoose.Schema<LobbyChannelType>({
  channelParent: { type: ObjectId, ref: TsChannel, require: true },
  channelParentSiblings: [{ type: ObjectId, ref: TsChannel, require: true }],
  description: { type: ObjectId, ref: TsDescription, require: true },
  prefix: { type: String, default: "" },
  minimum: { type: Number, default: 2 },
  clientLimit: { type: Number, default: -1 },
  permissions: [
    {
      key: { type: String, required: true },
      value: { type: Number, required: true },
    },
  ],
});

export default mongoose.model<LobbyChannelType>(
  "LobbyChannel",
  LobbyChannelSchema
);

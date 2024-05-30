import mongoose from "mongoose";
import { z } from "zod";

import TsChannel, { TsChannelZodSchema } from "models/teamspeak/TsChannel";
import TsCollection, {
  TsCollectionZodSchema,
} from "models/teamspeak/TsCollection";
import TsServergroup, {
  TsServergroupZodSchema,
} from "models/teamspeak/TsServergroup";

const SupportSpecialZodSchema = z.object({
  servergroup: TsServergroupZodSchema,
  contactServergroups: z.array(TsServergroupZodSchema),
  messagePrefix: z.object({
    text: z.string(),
    color: z.string(),
  }),
});

const SupportMessageZodSchema = z.object({
  channel: TsChannelZodSchema,
  contactServergroups: z.array(TsServergroupZodSchema),
  messageBody: z.string(),
  ignore: z.array(TsCollectionZodSchema),
  doNotDisturb: z.array(TsCollectionZodSchema),
  specials: z.array(SupportSpecialZodSchema),
});

type SupportMessageType = z.infer<typeof SupportMessageZodSchema>;

const { ObjectId } = mongoose.Schema.Types;
const SupportMessageSchema = new mongoose.Schema<SupportMessageType>({
  channel: { type: ObjectId, ref: TsChannel, required: true },
  contactServergroups: [{ type: ObjectId, ref: TsServergroup, required: true }],
  messageBody: { type: String, default: "" },
  ignore: [{ type: ObjectId, ref: TsCollection }],
  doNotDisturb: [{ type: ObjectId, ref: TsCollection }],
  specials: [
    {
      servergroup: { type: ObjectId, ref: TsServergroup, required: true },
      contactServergroups: [
        { type: ObjectId, ref: TsServergroup, required: true },
      ],
      messagePrefix: {
        text: { type: String, required: true },
        color: { type: String, default: "ff4444" },
      },
    },
  ],
});

export default mongoose.model<SupportMessageType>(
  "SupportMessage",
  SupportMessageSchema
);

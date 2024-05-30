import { Schema, Types, model } from "mongoose";

import CsServer, { CsServerType } from "models/general/CsServer";
import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";
import TsDescription, {
  TsDescriptionType,
} from "models/teamspeak/TsDescription";

type ServerDescriptionType = {
  title: string;
  subtitle: string;
  body: string;
  channel: TsChannelType;
  servers: CsServerType[];
  description?: TsDescriptionType;
};

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

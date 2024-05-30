import { Schema, Types, model } from "mongoose";

import CsServer, { CsServerType } from "models/general/CsServer";
import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";

type ServerTitleType = {
  prefix: string;
  title: string;
  body: string;
  channel: TsChannelType;
  server: CsServerType;
};

const ServerTitleSchema = new Schema<ServerTitleType>({
  prefix: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, default: "" },
  channel: { type: Types.ObjectId, ref: TsChannel, required: true },
  server: { type: Types.ObjectId, ref: CsServer, required: true },
});

export default model<ServerTitleType>("ServerTitle", ServerTitleSchema);

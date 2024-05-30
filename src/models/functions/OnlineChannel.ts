import { Schema, Types, model } from "mongoose";

import TsChannel, { TsChannelType } from "models/teamspeak/TsChannel";
import TsCollection, { TsCollectionType } from "models/teamspeak/TsCollection";
import TsServergroup, {
  TsServergroupType,
} from "models/teamspeak/TsServergroup";

type OnlineChannelType = {
  channel: TsChannelType;
  servergroups: TsServergroupType[];
  title: string;
  collections: TsCollectionType[];
};

const OnlineChannelSchema = new Schema<OnlineChannelType>({
  channel: { type: Types.ObjectId, ref: TsChannel, required: true },
  servergroups: [{ type: Types.ObjectId, ref: TsServergroup }],
  title: { type: String, required: true },
  collections: [{ type: Types.ObjectId, ref: TsCollection }],
});

export default model<OnlineChannelType>("OnlineChannel", OnlineChannelSchema);

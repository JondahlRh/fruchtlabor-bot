import LobbyChannel from "models/functions/LobbyChannel";

const populate = ["channelParent", "channelParentSiblings", "description"];

export const cachedFindLobbyChannels = async () => {
  try {
    return await LobbyChannel.find().populate(populate).lean().cache();
  } catch (error) {
    return [];
  }
};

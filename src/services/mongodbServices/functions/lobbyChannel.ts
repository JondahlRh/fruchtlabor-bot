import LobbyChannel from "models/functions/LobbyChannel";

const populate = ["channelParent", "channelParentSiblings", "description"];

export const findLobbyChannels = async () => {
  try {
    return await LobbyChannel.find().populate(populate);
  } catch (error) {
    return [];
  }
};

export const findLobbyChannelById = async (id: string) => {
  try {
    return await LobbyChannel.findById(id).populate(populate);
  } catch (error) {
    return null;
  }
};

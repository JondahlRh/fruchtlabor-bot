import { ClientData } from "src/types/general";
import { TsCollectionType } from "src/types/mongoose/teamspeak";

const checkChannel = (collection: TsCollectionType, clientData: ClientData) => {
  return collection.channels.some((x) => {
    return String(x.channelId) === clientData.channel;
  });
};

const checkChannelParent = (
  collection: TsCollectionType,
  clientData: ClientData
) => {
  return collection.channelParents.some((x) => {
    return String(x.channelId) === clientData.channelParent;
  });
};

const checkServergroups = (
  collection: TsCollectionType,
  clientData: ClientData
) => {
  return collection.servergroups.some((x) => {
    return clientData.servergroups.includes(String(x.servergroupId));
  });
};

export const clientMatchesCollection = (
  clientData: ClientData,
  collection: TsCollectionType
) => {
  return (
    checkChannel(collection, clientData) ||
    checkChannelParent(collection, clientData) ||
    checkServergroups(collection, clientData)
  );
};

export const clientMatchesCollectionsSorted = (
  clientData: ClientData,
  collections: TsCollectionType[]
) => {
  const foundChannel = collections.find((collection) =>
    checkChannel(collection, clientData)
  );
  if (foundChannel) return foundChannel;

  const foundChannelParent = collections.find((collection) =>
    checkChannelParent(collection, clientData)
  );
  if (foundChannelParent) return foundChannelParent;

  const foundServergroup = collections.find((collection) =>
    checkServergroups(collection, clientData)
  );
  if (foundServergroup) return foundServergroup;
};

import { TsCollectionType } from "models/teamspeak/TsCollection";

export type ClientData = {
  channel?: string;
  channelParent?: string;
  servergroups: string[];
};

const checkChannel = (collection: TsCollectionType, clientData: ClientData) => {
  return collection.channels.some((x) => {
    return x.id.toString() === clientData.channel;
  });
};

const checkChannelParent = (
  collection: TsCollectionType,
  clientData: ClientData
) => {
  return collection.channelParents.some((x) => {
    return x.id.toString() === clientData.channelParent;
  });
};

const checkServergroups = (
  collection: TsCollectionType,
  clientData: ClientData
) => {
  return collection.servergroups.some((x) => {
    return clientData.servergroups.includes(x.id.toString());
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

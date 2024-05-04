import TsCollection from "models/teamspeak/TsCollection";

const populate = ["channels", "channelParents", "servergroups"];

export const findTsCollections = async () => {
  try {
    return await TsCollection.find().populate(populate);
  } catch (error) {
    return [];
  }
};

export const findTsCollectionById = async (id: string) => {
  try {
    return await TsCollection.findById(id).populate(populate);
  } catch (error) {
    return null;
  }
};

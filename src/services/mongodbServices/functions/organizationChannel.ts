import OrganizationChannel from "models/functions/OrganizationChannel";

const populate = ["channel"];

export const findOrganizationChannels = async () => {
  try {
    return await OrganizationChannel.find().populate(populate).lean();
  } catch (error) {
    return [];
  }
};

export const findOrganizationChannelById = async (id: string) => {
  try {
    return await OrganizationChannel.findById(id).populate(populate).lean();
  } catch (error) {
    return null;
  }
};

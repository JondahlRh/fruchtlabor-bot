import OrganizationChannel from "models/functions/OrganizationChannel";

const populate = ["channel"];

export const findOrganizationChannels = async () => {
  try {
    return await OrganizationChannel.find().populate(populate).lean();
  } catch (error) {
    return [];
  }
};

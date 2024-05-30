import User from "models/auth/User";

const populate = [{ path: "roles", populate: ["permissions"] }, "permissions"];

export const findOneUserByApikey = async (apikey: string) => {
  try {
    return await User.findOne({ apikey }).populate(populate).lean();
  } catch (error) {
    return null;
  }
};

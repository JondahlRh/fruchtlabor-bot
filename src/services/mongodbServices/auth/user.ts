import User from "models/auth/User";

const populate = [{ path: "roles", populate: ["permissions"] }, "permissions"];

export const findUsers = async () => {
  try {
    return await User.find().populate(populate).lean();
  } catch (error) {
    return [];
  }
};

export const findUserById = async (id: string) => {
  try {
    return await User.findById(id).populate(populate).lean();
  } catch (error) {
    return null;
  }
};

export const findOneUserByApikey = async (apikey: string) => {
  try {
    return await User.findOne({ apikey }).populate(populate).lean();
  } catch (error) {
    return null;
  }
};

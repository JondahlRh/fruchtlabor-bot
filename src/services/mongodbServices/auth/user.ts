import User from "models/auth/User";

const populate = [{ path: "roles", populate: ["permissions"] }, "permissions"];

export const findOneUserByUsername = async (username: string) => {
  try {
    return await User.findOne({ username }).populate(populate).lean();
  } catch (error) {
    return null;
  }
};

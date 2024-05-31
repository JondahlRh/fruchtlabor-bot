import User from "models/auth/User";

const populate = [{ path: "roles", populate: ["permissions"] }, "permissions"];

export const findOneUserByUsername = async (username: string) => {
  try {
    return await User.findOne({ username }).populate(populate).lean();
  } catch (error) {
    return null;
  }
};

export const createUser = async (
  username: string,
  apikey: string,
  isOwner: boolean,
  permissions: string[],
  roles: string[]
) => {
  try {
    await User.create({ username, apikey, isOwner, permissions, roles });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

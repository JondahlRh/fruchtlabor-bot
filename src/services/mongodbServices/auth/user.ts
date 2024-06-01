import User from "models/auth/User";

const populate = [{ path: "roles", populate: ["permissions"] }, "permissions"];

export const findOneUserById = async (_id: string) => {
  try {
    return await User.findById(_id).populate(populate).lean();
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
    const user = await User.create({
      username,
      apikey,
      isOwner,
      permissions,
      roles,
    });
    return { success: true, _id: user._id };
  } catch (error) {
    return { success: false };
  }
};

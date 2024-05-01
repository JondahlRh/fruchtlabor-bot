import User from "models/auth/User";

export const findOneUser = async (apikey: string) => {
  try {
    return await User.findOne({ apikey }).populate([
      { path: "roles", populate: ["permissions"] },
      "permissions",
    ]);
  } catch (error) {
    return null;
  }
};

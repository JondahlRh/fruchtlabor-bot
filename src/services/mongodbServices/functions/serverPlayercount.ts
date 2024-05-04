import ServerPlayercount from "models/functions/ServerPlayercount";

const populate = ["channel", "server"];

export const findServerPlayercounts = async () => {
  try {
    return await ServerPlayercount.find().populate(populate);
  } catch (error) {
    return [];
  }
};

export const findServerPlayercountById = async (id: string) => {
  try {
    return await ServerPlayercount.findById(id).populate(populate);
  } catch (error) {
    return null;
  }
};

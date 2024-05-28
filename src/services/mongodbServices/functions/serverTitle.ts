import ServerTitle from "models/functions/ServerTitle";

const populate = ["channel", "server"];

export const findServerTitles = async () => {
  try {
    return await ServerTitle.find().populate(populate);
  } catch (error) {
    return [];
  }
};

export const findServerTitleById = async (id: string) => {
  try {
    return await ServerTitle.findById(id).populate(populate);
  } catch (error) {
    return null;
  }
};

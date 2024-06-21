import Fruit from "models/general/Fruit";

export const cachedFindFruits = async () => {
  try {
    return await Fruit.find().lean().cache("1h");
  } catch (error) {
    return [];
  }
};

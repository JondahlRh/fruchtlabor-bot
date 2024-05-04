import AsyncError from "models/general/AsyncError";

export const findAsyncErrors = async () => {
  try {
    return await AsyncError.find();
  } catch (error) {
    return [];
  }
};

export const findAsyncErrorById = async (id: string) => {
  try {
    return await AsyncError.findById(id);
  } catch (error) {
    return null;
  }
};

export const createAsyncError = async (error: Error, functionname: string) => {
  try {
    await AsyncError.create({
      function: functionname,
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

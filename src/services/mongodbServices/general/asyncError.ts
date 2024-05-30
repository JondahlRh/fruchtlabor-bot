import AsyncError from "models/general/AsyncError";

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

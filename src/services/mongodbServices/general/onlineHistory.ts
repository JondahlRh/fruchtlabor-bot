import { Types } from "mongoose";

import OnlineHistory from "models/general/OnlineHistory";

export const createOnlineHistory = async (
  client: string,
  type: Types.ObjectId,
  status: string
) => {
  try {
    await OnlineHistory.create({ client, type: type.toString(), status });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

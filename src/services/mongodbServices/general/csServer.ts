import CsServer from "models/general/CsServer";

export const findCsServers = async () => {
  try {
    return await CsServer.find().lean();
  } catch (error) {
    return [];
  }
};

export const findCsServerById = async (id: string) => {
  try {
    return await CsServer.findById(id).lean();
  } catch (error) {
    return null;
  }
};

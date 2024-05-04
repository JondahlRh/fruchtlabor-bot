import CsServer from "models/general/CsServer";

export const findCsServers = async () => {
  try {
    return await CsServer.find();
  } catch (error) {
    return [];
  }
};

export const findCsServerById = async (id: string) => {
  try {
    return await CsServer.findById(id);
  } catch (error) {
    return null;
  }
};

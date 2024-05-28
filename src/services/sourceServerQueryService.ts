import query from "source-server-query";
import { z } from "zod";

const ServerInfoZodSchema = z.object({
  players: z.number(),
  max_players: z.number(),
  bots: z.number(),
});

export type ServerInfoType = z.infer<typeof ServerInfoZodSchema>;

export const getServerInfo = async (host: string, port: number) => {
  try {
    const rawData = await query.info(host, port);

    const parsedData = ServerInfoZodSchema.safeParse(rawData);
    if (!parsedData.success) return null;

    return parsedData.data;
  } catch (error) {
    return null;
  }
};

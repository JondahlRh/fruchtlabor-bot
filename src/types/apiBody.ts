import { z } from "zod";

export const EditServergroupSchema = z.object({
  client: z.string(),
  servergroups: z.array(z.string()),
});

export const BanClientSchema = z.object({
  client: z.string(),
  banreason: z.string(),
});

export const ParamIdSchema = z.string();

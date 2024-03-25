import { z } from "zod";

export const EditServergroupSchema = z.object({
  client: z.string(),
  servergroups: z.array(z.string()),
});

export const DelteAllServergroupsSchema = z.object({
  client: z.string(),
});

export const PostBanClientSchema = z.object({
  client: z.string(),
  banreason: z.string(),
});

export const DelteBanClientSchema = z.object({
  banids: z.array(z.string()),
});

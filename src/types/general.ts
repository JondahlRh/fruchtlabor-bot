import { z } from "zod";

export const TsPermissionZodSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export type TsPermissionType = z.infer<typeof TsPermissionZodSchema>;

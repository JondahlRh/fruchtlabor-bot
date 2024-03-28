import { z } from "zod";

const DelteAllServergroupsSchema = z.object({
  client: z.string(),
});

export default DelteAllServergroupsSchema;

import { z } from "zod";

const EditServergroupSchema = z.object({
  client: z.string(),
  servergroups: z.array(z.string()),
});

export default EditServergroupSchema;

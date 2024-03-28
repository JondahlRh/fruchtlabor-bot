import { z } from "zod";

const PostBanClientSchema = z.object({
  client: z.string(),
  banreason: z.string(),
});

export default PostBanClientSchema;

import { z } from "zod";

const DelteBanClientSchema = z.object({
  banids: z.array(z.string()),
});

export default DelteBanClientSchema;

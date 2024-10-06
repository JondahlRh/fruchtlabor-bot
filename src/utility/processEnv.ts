import { z } from "zod";

const PORT_REGEX = /^\d{1,5}$/;
const IP_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

const envObject = z.object({
  INTERNAL_PORT: z.string().regex(PORT_REGEX),

  TEAMSPEAK_HOST: z.string().regex(IP_REGEX),
  TEAMSPEAK_PORT: z.string().regex(PORT_REGEX),
  TEAMSPEAK_QUERYPORT: z.string().regex(PORT_REGEX),
  TEAMSPEAK_USERNAME: z.string(),
  TEAMSPEAK_PASSWORD: z.string(),
  TEAMSPEAK_NICKNAME: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envObject> {}
  }
}

function processEnv() {
  envObject.parse(process.env);
  console.log("Process env parsed succesfully...");
}

export default processEnv;

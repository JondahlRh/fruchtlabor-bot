import { z } from "zod";

const IP_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
const PORT_REGEX = /^\d{1,5}$/;
const MONGODB_REGEX = /^mongodb:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/?$/;

const envObject = z.object({
  FEATUREFLAG_BOT: z.union([z.literal("true"), z.literal("false")]),
  FEATUREFLAG_API: z.union([z.literal("true"), z.literal("false")]),
  TEAMSPEAK_IP: z.string().regex(IP_REGEX),
  TEAMSPEAK_PORT: z.string().regex(PORT_REGEX),
  TEAMSPEAK_QUERYPORT: z.string().regex(PORT_REGEX),
  TEAMSPEAKQUERY_USERNAME: z.string(),
  TEAMSPEAKQUERY_PASSWORD: z.string(),
  TEAMSPEAK_NICKNAME: z.string(),
  MONGODB_CONNECT: z.string().regex(MONGODB_REGEX),
  MONGODB_DBNAME: z.string(),
  API_KEY: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envObject> {}
  }
}

export default () => {
  const parsedProccesEnv = envObject.safeParse(process.env);

  if (!parsedProccesEnv.success) {
    throw parsedProccesEnv.error.flatten().fieldErrors;
  }

  console.log("process env parsed succesfully");
};

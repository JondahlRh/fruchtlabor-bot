import { BanEntry } from "ts3-nodejs-library/lib/types/ResponseTypes";

export type MappedBan = {
  id: number;
  reason: string;
  uuid: string | null;
  ip: string | null;
};

const banMapper = (ban: BanEntry) => {
  return {
    id: +ban.banid,
    reason: ban.reason,
    uuid: ban.uid ?? null,
    ip: ban.ip ?? null,
  };
};

export default banMapper;

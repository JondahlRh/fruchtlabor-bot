import { BanEntry } from "ts3-nodejs-library/lib/types/ResponseTypes";

const banMapper = (ban: BanEntry): MappedBan => {
  return {
    id: Number(ban.banid),
    reason: ban.reason,
    uuid: ban.uid ?? null,
    ip: ban.ip ?? null,
  };
};

export default banMapper;

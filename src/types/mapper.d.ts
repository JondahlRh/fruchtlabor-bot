type MappedChannel = {
  name: string;
  id: number;
};

type MappedClient = {
  name: string;
  uuid: string;
  dbid: number;
};

type MappedServerGroup = {
  name: string;
  id: number;
};

type MappedBan = {
  id: number;
  reason: string;
  uuid: string | null;
  ip: string | null;
};

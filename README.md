.creds file needed
example .creds file:

const PROD = {
SERVER_IP: "", // add Teamspeak Server IP Adress
SERVER_PORT: , // add Teamspeak (Voice) Port [Default: 9987]
QUERY_USERNAME: "", // add Server Querry Username
QUERY_PASSWORD: "", // add Server Querry Password
};

const DEV = {
SERVER_IP: "", // add Teamspeak Server IP Adress
SERVER_PORT: , // add Teamspeak (Voice) Port [Default: 9987]
QUERY_USERNAME: "", // add Server Querry Username
QUERY_PASSWORD: "", // add Server Querry Password
};

module.exports = { PROD, DEV };

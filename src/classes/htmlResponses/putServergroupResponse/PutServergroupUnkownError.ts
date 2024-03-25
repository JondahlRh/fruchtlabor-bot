export default class PutServergroupUnkownError {
  readonly success = false;
  readonly message = "An unkown teamspeak error occured!";
  servergroupid: string;

  constructor(servergroupid: string) {
    this.servergroupid = servergroupid;
  }
}

export default class PutServergroupIdError {
  readonly success = false;
  readonly message = "The provided servergroup id does not exist!";
  servergroupid: string;

  constructor(servergroupid: string) {
    this.servergroupid = servergroupid;
  }
}

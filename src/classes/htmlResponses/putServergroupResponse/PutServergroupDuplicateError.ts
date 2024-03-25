export default class PutServergroupDuplicateError {
  readonly success = false;
  readonly message = "The provided servergroup is already applied!";
  servergroupid: string;

  constructor(servergroupid: string) {
    this.servergroupid = servergroupid;
  }
}

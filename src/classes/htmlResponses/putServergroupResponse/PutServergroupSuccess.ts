export default class PutServergroupSuccess {
  readonly success = true;
  servergroupid: string;

  constructor(servergroupid: string) {
    this.servergroupid = servergroupid;
  }
}

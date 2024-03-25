export default class DeleteServergroupSuccess {
  readonly success = true;
  servergroupid: string;

  constructor(servergroupid: string) {
    this.servergroupid = servergroupid;
  }
}

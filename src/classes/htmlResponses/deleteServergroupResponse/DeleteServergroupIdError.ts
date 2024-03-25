export default class DeleteServergroupIdError {
  readonly success = false;
  readonly message = "The provided servergroup id does not exist!";
  servergroupid: string;

  constructor(servergroupid: string) {
    this.servergroupid = servergroupid;
  }
}

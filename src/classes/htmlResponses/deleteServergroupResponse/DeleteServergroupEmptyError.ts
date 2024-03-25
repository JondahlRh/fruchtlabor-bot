export default class DeleteServergroupEmptyError {
  readonly success = false;
  readonly message = "The provided servergroup is already removed!";
  servergroupid: string;

  constructor(servergroupid: string) {
    this.servergroupid = servergroupid;
  }
}

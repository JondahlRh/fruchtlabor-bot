export default class DeleteBanBanidError {
  readonly success = false;
  readonly message = "The provided ban id does not exist!";
  banid: string;

  constructor(banid: string) {
    this.banid = banid;
  }
}

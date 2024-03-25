export default class DeleteBanUnkownError {
  readonly success = false;
  readonly message = "An unkown teamspeak error occured!";
  banid: string;

  constructor(banid: string) {
    this.banid = banid;
  }
}

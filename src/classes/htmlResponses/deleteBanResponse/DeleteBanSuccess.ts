export default class DeleteBanSuccess {
  readonly success = true;
  banid: string;

  constructor(banid: string) {
    this.banid = banid;
  }
}

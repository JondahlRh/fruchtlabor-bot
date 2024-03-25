export default class IpBanSuccess {
  readonly success = true;
  banid: string;

  constructor(banid: string) {
    this.banid = banid;
  }
}

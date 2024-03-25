export default class IpBanSuccess {
  success: boolean;
  banid: string;

  constructor(banid: string) {
    this.success = true;
    this.banid = banid;
  }
}

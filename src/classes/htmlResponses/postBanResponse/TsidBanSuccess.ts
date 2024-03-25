export default class TsidBanSuccess {
  readonly success = true;
  banid: string;

  constructor(banid: string) {
    this.banid = banid;
  }
}

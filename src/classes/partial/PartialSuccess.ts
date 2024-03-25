export default class PartialSuccess {
  readonly success = true;
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

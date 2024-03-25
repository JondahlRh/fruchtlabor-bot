export default class UnkownError {
  readonly success = false;
  readonly message = "An unkown teamspeak error occured!";
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export default class PartialError {
  readonly success = false;
  message: string;
  id: string;

  constructor(message: string, id: string) {
    this.message = message;
    this.id = id;
  }
}

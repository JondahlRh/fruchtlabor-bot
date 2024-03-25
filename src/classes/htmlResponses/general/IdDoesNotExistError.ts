export default class IdDoesNotExistError {
  readonly success = false;
  readonly message = "Id does not exist!";
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

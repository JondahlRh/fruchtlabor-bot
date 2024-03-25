import PartialError from "./PartialError";

export default class PartialEmptyError extends PartialError {
  constructor(id: string) {
    super("The id is already removed!", id);
  }
}

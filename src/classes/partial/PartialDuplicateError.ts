import PartialError from "./PartialError";

export default class PartialDuplicateError extends PartialError {
  constructor(id: string) {
    super("The id is already applied!", id);
  }
}

import PartialError from "./PartialError";

export default class PartialIdError extends PartialError {
  constructor(id: string) {
    super("The id does not exist!", id);
  }
}

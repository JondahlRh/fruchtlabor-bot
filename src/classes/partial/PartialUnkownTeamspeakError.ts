import PartialError from "./PartialError";

export default class PartialUnkownTeamspeakError extends PartialError {
  constructor(id: string) {
    super("An unkown teamspeak error occured!", id);
  }
}

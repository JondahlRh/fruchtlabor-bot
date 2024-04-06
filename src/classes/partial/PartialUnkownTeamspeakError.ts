import PartialError from "./PartialError";

export default class PartialUnknownTeamspeakError extends PartialError {
  constructor(id: string) {
    super("An unknown teamspeak error occured!", id);
  }
}

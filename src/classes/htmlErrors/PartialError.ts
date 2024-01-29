import { SingleError } from "../../types/error";
import HtmlError from "../HtmlError";

export default class PartialError extends HtmlError {
  errors: SingleError[];

  constructor(errors: SingleError[]) {
    super(`Partiall error${errors.length === 1 ? "s" : ""} occured!`, 200);
    this.errors = errors;
  }
}

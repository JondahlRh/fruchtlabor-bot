import HtmlError from "./HtmlError";
import KeyValue from "./KeyValue";

export default class KeyValueError extends HtmlError {
  field: KeyValue;

  constructor(message: string, statuscode: number, field: KeyValue) {
    super(message, statuscode);
    this.field = field;
  }
}

import HtmlError from "../HtmlError";
import KeyValueRequiredType from "../KeyValueRequiredType";

export default class WrongTypeError extends HtmlError {
  field: KeyValueRequiredType;

  constructor(key: string, value: any, requiredType: string) {
    super("The provided type is not valid!", 400);
    this.field = new KeyValueRequiredType(key, value, requiredType);
  }
}

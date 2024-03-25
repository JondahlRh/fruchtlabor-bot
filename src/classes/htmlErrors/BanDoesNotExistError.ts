import KeyValue from "../KeyValue";
import KeyValueError from "../KeyValueError";

export default class BanDoesNotExistError extends KeyValueError {
  constructor(key: string, value: any) {
    const field = new KeyValue(key, value);
    super("The provided ban id does not exist!", 400, field);
  }
}

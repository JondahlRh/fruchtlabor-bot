import KeyValue from "../KeyValue";
import KeyValueError from "../KeyValueError";

export default class ServergroupDoesNotExistError extends KeyValueError {
  constructor(key: string, value: any) {
    const field = new KeyValue(key, value);
    super("The provided servergroup does not exist!", 400, field);
  }
}

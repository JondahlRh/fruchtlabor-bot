import KeyValue from "../keyvalues/KeyValue";
import KeyValueError from "../keyvalues/KeyValueError";

export default class ClientDoesNotExistError extends KeyValueError {
  constructor(key: string, value: any) {
    const field = new KeyValue(key, value);
    super("The provided client does not exist!", 400, field);
  }
}

import KeyValue from "../KeyValue";
import KeyValueError from "../KeyValueError";

export default class ClientDoesNotExistError extends KeyValueError {
  constructor(key: string, value: any) {
    const field = new KeyValue(key, value);
    super("The provided client does not exist or is not online!", 400, field);
  }
}

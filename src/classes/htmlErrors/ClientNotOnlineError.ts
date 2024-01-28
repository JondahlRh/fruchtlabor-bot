import KeyValue from "../KeyValue";
import KeyValueError from "../KeyValueError";

export default class ClientNotOnlineError extends KeyValueError {
  constructor(key: string, value: any) {
    const field = new KeyValue(key, value);
    super("The provided client is not online!", 400, field);
  }
}

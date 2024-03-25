import KeyValue from "../keyvalues/KeyValue";
import KeyValueError from "../keyvalues/KeyValueError";

export default class ChannelDoesNotExistError extends KeyValueError {
  constructor(key: string, value: any) {
    const field = new KeyValue(key, value);
    super("The provided channel does not exist!", 400, field);
  }
}

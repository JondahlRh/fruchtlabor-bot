import KeyValue from "../KeyValue";
import KeyValueError from "../KeyValueError";

export default class ServergroupDuplicateEntry extends KeyValueError {
  constructor(key: string, value: any) {
    const field = new KeyValue(key, value);
    super("The provided servergroup is already applied!", 400, field);
  }
}

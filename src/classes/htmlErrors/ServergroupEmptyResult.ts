import KeyValue from "../KeyValue";
import KeyValueError from "../KeyValueError";

export default class ServergroupEmptyResult extends KeyValueError {
  constructor(key: string, value: any) {
    const field = new KeyValue(key, value);
    super("The provided servergroup is already removed!", 400, field);
  }
}

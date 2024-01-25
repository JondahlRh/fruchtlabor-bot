import KeyValue from "./KeyValue";

export default class KeyValueRequiredType extends KeyValue {
  requiredType: string;

  constructor(key: string, value: any, requiredType: string) {
    super(key, value);
    this.requiredType = requiredType;
  }
}

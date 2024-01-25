export default class HtmlError {
  message: string;
  statuscode: number;

  constructor(message: string, statuscode: number) {
    this.message = message;
    this.statuscode = statuscode;
  }
}

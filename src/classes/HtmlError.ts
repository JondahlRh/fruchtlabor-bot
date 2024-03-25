export default class HtmlError extends Error {
  statuscode: number;

  constructor(message: string, statuscode: number, stack?: string) {
    super(message);
    this.statuscode = statuscode;

    this.stack = stack;
  }
}

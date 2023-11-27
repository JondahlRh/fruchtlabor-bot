export class HtmlError extends Error {
  htmlCode: number;
  errorCode: string;

  constructor(message: string, htmlCode: number, errorCode: string) {
    super(message);
    this.htmlCode = htmlCode;
    this.errorCode = errorCode;
  }
}

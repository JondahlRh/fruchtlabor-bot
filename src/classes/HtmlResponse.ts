export default class HtmlResponse<T> {
  message: string;
  statusCode: number;
  data: T;

  constructor(message: string, data: T, statusCode: number = 200) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}

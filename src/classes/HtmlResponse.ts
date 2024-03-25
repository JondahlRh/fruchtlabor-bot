export default class HtmlResponse<T> {
  message: string;
  status: number;
  data: T;

  constructor(message: string, status: number, data: T) {
    this.message = message;
    this.status = status;
    this.data = data;
  }
}

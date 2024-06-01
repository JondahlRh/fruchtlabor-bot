import HtmlResponse from "classes/HtmlResponse";

class TokenData {
  username: string;
  token: string;

  constructor(username: string, token: string) {
    this.username = username;
    this.token = token;
  }
}

export default class PostGenerateTokenResponse extends HtmlResponse<TokenData> {
  constructor(username: string, token: string) {
    super("Token generated!", 201, new TokenData(username, token));
  }
}

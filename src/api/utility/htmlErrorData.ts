import ApiErrorCodes from "../enums/ApiErrorCodes";
import {
  HtmlError,
  HtmlErrorResponse,
  SinglErrorResponse,
  SingleError,
} from "../types/errors";

const getHtmlStatusCode = (errorCode: ApiErrorCodes) => {
  switch (errorCode) {
    case ApiErrorCodes.PARTIAL_ERROR:
      return 200;

    case ApiErrorCodes.CHANNEL_DOES_NOT_EXIST:
    case ApiErrorCodes.CLIENT_DOES_NOT_EXIST:
    case ApiErrorCodes.SERVERGROUP_DOES_NOT_EXIST:
    case ApiErrorCodes.SERVERGROUP_DUPLICATE_ENTRY:
    case ApiErrorCodes.SERVERGROUP_EMPTY_RESULT:
    case ApiErrorCodes.WRONG_TYPE:
      return 400;

    case ApiErrorCodes.UNKOWN_ROUTE:
      return 404;

    default:
      return 500;
  }
};

function getHtmlResponse(error: HtmlError): HtmlErrorResponse;
function getHtmlResponse(error: SingleError): SinglErrorResponse;

function getHtmlResponse(error: HtmlError | SingleError) {
  switch (error.errorCode) {
    case ApiErrorCodes.UNKOWN_ROUTE:
      return {
        message: "Route does not exist!",
        errorCode: error.errorCode,
      };

    case ApiErrorCodes.UNKOWN_TEAMSPEAK_ERROR:
      return {
        message: "An unkown teamspeak error occured!",
        errorCode: error.errorCode,
      };

    case ApiErrorCodes.CHANNEL_DOES_NOT_EXIST:
      return {
        message: "The provided channel does not exist!",
        errorCode: error.errorCode,
        field: error.field,
      };
    case ApiErrorCodes.CLIENT_DOES_NOT_EXIST:
      return {
        message: "The provided client does not exist or is not online!",
        errorCode: error.errorCode,
        field: error.field,
      };
    case ApiErrorCodes.SERVERGROUP_DOES_NOT_EXIST:
      return {
        message: "The provided servergroup does not exist!",
        errorCode: error.errorCode,
        field: error.field,
      };
    case ApiErrorCodes.SERVERGROUP_DUPLICATE_ENTRY:
      return {
        message: "The provided servergroup is already applied!",
        errorCode: error.errorCode,
        field: error.field,
      };
    case ApiErrorCodes.SERVERGROUP_EMPTY_RESULT:
      return {
        message: "The provided servergroup is already removed!",
        errorCode: error.errorCode,
        field: error.field,
      };
    case ApiErrorCodes.WRONG_TYPE:
      return {
        message: "The provided type is not valid!",
        errorCode: error.errorCode,
        field: error.field,
      };

    case ApiErrorCodes.PARTIAL_ERROR:
      return {
        message: "Partiall error(s) occured!",
        errorCode: error.errorCode,
        errors: error.errors.map(getHtmlResponse),
      };

    default:
      return {
        message: "An unkown error occured!",
        errorCode: error.errorCode,
      };
  }
}

export { getHtmlStatusCode, getHtmlResponse };

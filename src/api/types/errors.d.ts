import ApiErrorCodes from "../enums/ApiErrorCodes";

type KeyValueDoesNotExistError = {
  errorCode:
    | ApiErrorCodes.CHANNEL_DOES_NOT_EXIST
    | ApiErrorCodes.CLIENT_DOES_NOT_EXIST
    | ApiErrorCodes.SERVERGROUP_DOES_NOT_EXIST;
  field: { key: string; value: any };
};

type DuplicateEntryError = {
  errorCode: ApiErrorCodes.SERVERGROUP_DUPLICATE_ENTRY;
  field: { key: string; value: any };
};

type EmptyResultError = {
  errorCode: ApiErrorCodes.SERVERGROUP_EMPTY_RESULT;
  field: { key: string; value: any };
};

type WrongTypeError = {
  errorCode: ApiErrorCodes.WRONG_TYPE;
  field: { key: string; value: any; requiredType: string };
};

type UnkownError = {
  errorCode:
    | ApiErrorCodes.UNKOWN_ERROR
    | ApiErrorCodes.UNKOWN_ROUTE
    | ApiErrorCodes.UNKOWN_TEAMSPEAK_ERROR;
};
type SingleError =
  | UnkownError
  | KeyValueDoesNotExistError
  | WrongTypeError
  | DuplicateEntryError
  | EmptyResultError;

type PartialError = {
  errorCode: ApiErrorCodes.PARTIAL_ERROR;
  errors: SingleError[];
};

type HtmlError = SingleError | PartialError;

type HtmlErrorResponse = HtmlError & { message: string };
type SinglErrorResponse = SingleError & { message: string };

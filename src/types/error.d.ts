import {
  AuthError,
  ChannelDoesNotExistError,
  ClientDoesNotExistError,
  ServergroupDoesNotExistError,
  ServergroupDuplicateEntry,
  ServergroupEmptyResult,
  UnkownError,
  UnkownRouteError,
  UnkownTeamspeakError,
} from "../classes/htmlErrors";

type SingleError =
  | AuthError
  | UnkownRouteError
  | UnkownTeamspeakError
  | ChannelDoesNotExistError
  | ClientDoesNotExistError
  | ServergroupDoesNotExistError
  | ServergroupDuplicateEntry
  | ServergroupEmptyResult
  | UnkownError;

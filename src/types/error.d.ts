import AuthError from "../classes/htmlErrors/AuthError";
import ChannelDoesNotExistError from "../classes/htmlErrors/ChannelDoesNotExistError";
import ClientDoesNotExistError from "../classes/htmlErrors/ClientDoesNotExistError";
import ServergroupDoesNotExistError from "../classes/htmlErrors/ServergroupDoesNotExistError";
import ServergroupDuplicateEntry from "../classes/htmlErrors/ServergroupDuplicateEntry";
import ServergroupEmptyResult from "../classes/htmlErrors/ServergroupEmptyResult";
import UnkownError from "../classes/htmlErrors/UnkownError";
import UnkownRouteError from "../classes/htmlErrors/UnkownRouteError";
import UnkownTeamspeakError from "../classes/htmlErrors/UnkownTeamspeakError";

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

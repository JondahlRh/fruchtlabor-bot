import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { customAlphabet } from "nanoid";
import { z } from "zod";

import { RequestBodyError } from "classes/htmlErrors";
import UnknownDatabaseError from "classes/htmlErrors/UnknownDatabaseError";
import UnknownServerError from "classes/htmlErrors/UnknownServerError";
import PostGenerateTokenResponse from "classes/htmlSuccesses/PostGenerateTokenResponse";

import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";

import { createUser } from "services/mongodbServices/auth/user";

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(ALPHABET, 32);

const GenerateTokenSchema = z.object({
  username: z.string(),
  isOwner: z.boolean(),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
});

export default (): RequestHandler => {
  return async (req, res, next) => {
    const requestBody = GenerateTokenSchema.safeParse(req.body);
    if (!requestBody.success) {
      return restrictedNext(next, new RequestBodyError(requestBody.error));
    }

    const { username, isOwner, roles, permissions } = requestBody.data;
    const apikey = nanoid();

    let encryptedApikey: string;
    try {
      encryptedApikey = await bcrypt.hash(apikey, 12);
    } catch (error) {
      return restrictedNext(next, new UnknownServerError());
    }

    const createdUser = await createUser(
      username,
      encryptedApikey,
      isOwner,
      permissions,
      roles
    );

    if (!createdUser.success) {
      return restrictedNext(next, new UnknownDatabaseError());
    }

    const token = createdUser._id + ":" + apikey;

    return restrictedResponse(
      res,
      new PostGenerateTokenResponse(username, token)
    );
  };
};

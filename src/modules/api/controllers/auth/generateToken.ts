import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";
import { z } from "zod";

import { RequestBodyError } from "classes/htmlErrors";
import UnknownDatabaseError from "classes/htmlErrors/UnknownDatabaseError";
import UnknownServerError from "classes/htmlErrors/UnknownServerError";
import SingleDataResponse from "classes/htmlSuccesses/SingleDataResponse";

import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";

import { createUser } from "services/mongodbServices/auth/user";

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(ALPHABET, 16);

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
    const encryptedApikey = await bcrypt.hash(apikey, 12);

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

    let token: string;
    try {
      token = jwt.sign({ username, apikey }, process.env.JWT_SECRET);
    } catch (error) {
      return restrictedNext(next, new UnknownServerError());
    }

    return restrictedResponse(
      res,
      new SingleDataResponse({ username, apikey, token })
    );
  };
};

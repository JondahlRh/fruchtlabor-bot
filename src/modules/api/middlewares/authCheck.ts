import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { AuthForbidden, AuthUnauthorized } from "classes/htmlErrors";
import UnknownServerError from "classes/htmlErrors/UnknownServerError";

import { PermissionType } from "models/auth/Permission";

import restrictedNext from "modules/api/utility/restrictedNext";

import { findOneUserByUsername } from "services/mongodbServices/auth/user";

const JwtPayloadZodSchema = z.object({
  username: z.string(),
  apikey: z.string(),
});

type JwtPayloadType = z.infer<typeof JwtPayloadZodSchema>;

export default (permission?: string): RequestHandler => {
  const checkPermission = (data: { permissions: PermissionType[] }) => {
    return data.permissions.some((x) => x.name === permission);
  };

  return async (req, res, next) => {
    const apikey = req.headers.authorization?.split(" ")[1];
    if (!apikey) return restrictedNext(next, new AuthUnauthorized());

    let apikeyData: JwtPayloadType;
    try {
      const decodedJwtToken = jwt.verify(apikey, process.env.JWT_SECRET);
      apikeyData = JwtPayloadZodSchema.parse(decodedJwtToken);
    } catch (error) {
      return restrictedNext(next, new AuthUnauthorized());
    }

    const user = await findOneUserByUsername(apikeyData.username);
    if (!user) return restrictedNext(next, new AuthUnauthorized());

    let isValidApikey = false;
    try {
      isValidApikey = await bcrypt.compare(apikeyData.apikey, user.apikey);
    } catch (error) {
      return restrictedNext(next, new UnknownServerError());
    }
    if (!isValidApikey) return restrictedNext(next, new AuthUnauthorized());

    const isOwner = user.isOwner;
    if (isOwner) return next();

    if (!permission) return restrictedNext(next, new AuthUnauthorized());

    if (checkPermission(user) || user.roles.some(checkPermission)) {
      return next();
    }

    restrictedNext(next, new AuthForbidden());
  };
};

import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { z } from "zod";

import { AuthForbidden, AuthUnauthorized } from "classes/htmlErrors";
import UnknownServerError from "classes/htmlErrors/UnknownServerError";

import { PermissionType } from "models/auth/Permission";

import restrictedNext from "modules/api/utility/restrictedNext";

import { findOneUserById } from "services/mongodbServices/auth/user";

const TokenDataSChema = z.tuple([z.string(), z.string()]);

export default (permission?: string): RequestHandler => {
  const checkPermission = (data: { permissions: PermissionType[] }) => {
    return data.permissions.some((x) => x.name === permission);
  };

  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return restrictedNext(next, new AuthUnauthorized());

    const tokenData = TokenDataSChema.safeParse(token.split(":"));
    if (!tokenData.success) return restrictedNext(next, new AuthUnauthorized());
    const [tokenId, tokenApikey] = tokenData.data;

    const user = await findOneUserById(tokenId);
    if (!user) return restrictedNext(next, new AuthUnauthorized());

    let isValidApikey = false;
    try {
      isValidApikey = await bcrypt.compare(tokenApikey, user.apikey);
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

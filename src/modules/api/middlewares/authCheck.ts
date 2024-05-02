import { RequestHandler } from "express";
import { findOneUser } from "services/mongodbServices/auth";

import { AuthForbidden, AuthUnauthorized } from "classes/htmlErrors";

import restrictedNext from "modules/api/utility/restrictedNext";

export default (permission: string): RequestHandler => {
  return async (req, res, next) => {
    const apikey = req.headers.authorization?.split(" ")[1];
    if (!apikey) return restrictedNext(next, new AuthUnauthorized());

    const user = await findOneUser(apikey);
    if (!user) return restrictedNext(next, new AuthUnauthorized());

    if (user.isOwner) return next();

    const hasDirectPermission = user.permissions.some(
      (x) => x.name === permission
    );
    if (hasDirectPermission) return next();

    const hasRolePermission = user.roles.some((x) =>
      x.permissions.some((y) => y.name === permission)
    );
    if (hasRolePermission) return next();

    restrictedNext(next, new AuthForbidden());
  };
};

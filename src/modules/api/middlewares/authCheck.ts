import { RequestHandler } from "express";

import { AuthForbidden, AuthUnauthorized } from "classes/htmlErrors";

import restrictedNext from "modules/api/utility/restrictedNext";

import { findOneUserByApikey } from "services/mongodbServices/auth/user";

export default (permission: string): RequestHandler => {
  return async (req, res, next) => {
    const apikey = req.headers.authorization?.split(" ")[1];
    if (!apikey) return restrictedNext(next, new AuthUnauthorized());

    const user = await findOneUserByApikey(apikey);
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

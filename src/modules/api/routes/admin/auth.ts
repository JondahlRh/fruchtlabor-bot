import { Router } from "express";

import Permission from "models/auth/Permission";
import Role from "models/auth/Role";
import User from "models/auth/User";

import authCheck from "modules/api/middlewares/authCheck";

import {
  findPermissionById,
  findPermissions,
} from "services/mongodbServices/auth/permission";
import { findRoleById, findRoles } from "services/mongodbServices/auth/role";
import { findUserById, findUsers } from "services/mongodbServices/auth/user";

import adminRouteBuilder from "./adminRouteBuilder";

export default () => {
  const route = Router();

  route.use(
    "/permission",
    authCheck("manage_permission"),
    adminRouteBuilder(Permission, findPermissions, findPermissionById)
  );
  route.use(
    "/role",
    authCheck("manage_role"),
    adminRouteBuilder(Role, findRoles, findRoleById)
  );
  route.use(
    "/user",
    authCheck("manage_user"),
    adminRouteBuilder(User, findUsers, findUserById)
  );

  return route;
};

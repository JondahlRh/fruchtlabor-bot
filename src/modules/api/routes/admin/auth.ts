import { Router } from "express";

import Permission from "models/auth/Permission";
import Role from "models/auth/Role";
import User from "models/auth/User";

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
    adminRouteBuilder(Permission, findPermissions, findPermissionById)
  );
  route.use("/role", adminRouteBuilder(Role, findRoles, findRoleById));
  route.use("/user", adminRouteBuilder(User, findUsers, findUserById));

  return route;
};

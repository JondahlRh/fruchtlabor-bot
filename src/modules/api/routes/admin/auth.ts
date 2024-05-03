import { Router } from "express";

import Permission, { PermissionZodSchema } from "models/auth/Permission";
import Role, { RoleZodSchema } from "models/auth/Role";
import User, { UserZodSchema } from "models/auth/User";

import adminRouteBuilder from "./adminRouteBuilder";

export default () => {
  const route = Router();

  route.use("/permission", adminRouteBuilder(Permission, PermissionZodSchema));
  route.use("/role", adminRouteBuilder(Role, RoleZodSchema));
  route.use("/user", adminRouteBuilder(User, UserZodSchema));

  return route;
};

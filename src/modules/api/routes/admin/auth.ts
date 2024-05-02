import { Router } from "express";

import Permission, { PermissionZodSchema } from "models/auth/Permission";
import Role, { RoleZodSchema } from "models/auth/Role";
import User, { UserZodSchema } from "models/auth/User";

import adminRouteBuilder from "./adminRouteBuilder";

export default () => {
  const route = Router();

  route.use(adminRouteBuilder("permission", Permission, PermissionZodSchema));
  route.use(adminRouteBuilder("role", Role, RoleZodSchema));
  route.use(adminRouteBuilder("user", User, UserZodSchema));

  return route;
};

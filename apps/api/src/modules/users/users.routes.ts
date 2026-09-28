import { Router } from "express";
import * as controller from "@/modules/users/users.controller";
import { authenticate } from "@/common/middleware/authenticate";
import { authorize } from "@/common/middleware/authorize";
import { validate } from "@/common/middleware/validate";
import { PERMISSIONS } from "@/common/constants/roles";
import {
  createUserSchema,
  createDepartmentSchema,
  grantAuthoritySchema,
  idParamSchema,
  listUsersSchema,
  updateDepartmentSchema,
  updatePermissionsSchema,
  updateUserSchema,
} from "@/modules/users/users.validation";

const router = Router();

// All users-module routes require a valid JWT
router.use(authenticate);

// ─── Stats (Super Admin + those with users:list) ──────────────────────────────
router.get("/stats", authorize(PERMISSIONS.USERS_LIST), controller.stats);

// ─── User CRUD ────────────────────────────────────────────────────────────────
// List / Create / Read / Update / Delete are gated to Super Admin OR a user
// who has been granted the users:create / users:edit / users:delete permissions.

router.get(
  "/",
  authorize(PERMISSIONS.USERS_LIST),
  validate(listUsersSchema),
  controller.list,
);

router.post(
  "/",
  authorize(PERMISSIONS.USERS_CREATE),
  validate(createUserSchema),
  controller.create,
);

router.get(
  "/:id",
  authorize(PERMISSIONS.USERS_LIST),
  validate(idParamSchema),
  controller.getById,
);

router.patch(
  "/:id",
  authorize(PERMISSIONS.USERS_EDIT),
  validate(updateUserSchema),
  controller.update,
);

router.delete(
  "/:id",
  authorize(PERMISSIONS.USERS_DELETE),
  validate(idParamSchema),
  controller.remove,
);

// Suspend a user (sets status=SUSPENDED). Separate endpoint to make UI actions explicit.
router.patch(
  "/:id/suspend",
  authorize(PERMISSIONS.USERS_EDIT),
  validate(idParamSchema),
  controller.suspend,
);

// ─── Per-user Permission Management (Super Admin only) ────────────────────────
router.put(
  "/:id/permissions",
  authorize(PERMISSIONS.USERS_MANAGE_AUTHORITY),
  validate(updatePermissionsSchema),
  controller.updatePermissions,
);

// ─── Temporary Users-Module Authority (Super Admin only) ─────────────────────
router.post(
  "/:id/authority/grant",
  authorize(PERMISSIONS.USERS_MANAGE_AUTHORITY),
  validate(grantAuthoritySchema),
  controller.grantAuthority,
);

router.post(
  "/:id/authority/revoke",
  authorize(PERMISSIONS.USERS_MANAGE_AUTHORITY),
  validate(idParamSchema),
  controller.revokeAuthority,
);

// ─── Departments ──────────────────────────────────────────────────────────────
router.get(
  "/departments",
  authorize(PERMISSIONS.DEPARTMENTS_LIST),
  controller.listDepartments,
);

router.post(
  "/departments",
  authorize(PERMISSIONS.DEPARTMENTS_CREATE),
  validate(createDepartmentSchema),
  controller.createDepartment,
);

router.patch(
  "/departments/:id",
  authorize(PERMISSIONS.DEPARTMENTS_EDIT),
  validate(updateDepartmentSchema),
  controller.updateDepartment,
);

router.delete(
  "/departments/:id",
  authorize(PERMISSIONS.DEPARTMENTS_DELETE),
  validate(idParamSchema),
  controller.deleteDepartment,
);

export default router;

import { Router } from "express";
import * as controller from "@/modules/users/users.controller";
import { authenticate } from "@/common/middleware/authenticate";
import { authorize } from "@/common/middleware/authorize";
import { validate } from "@/common/middleware/validate";
import { PERMISSIONS } from "@/common/constants/roles";
import { idParamSchema, listUsersSchema, updateUserSchema } from "@/modules/users/users.validation";

const router = Router();

router.use(authenticate, authorize(PERMISSIONS.USERS_MANAGE));

router.get("/", validate(listUsersSchema), controller.list);
router.get("/:id", validate(idParamSchema), controller.getById);
router.patch("/:id", validate(updateUserSchema), controller.update);
router.delete("/:id", validate(idParamSchema), controller.deactivate);

export default router;

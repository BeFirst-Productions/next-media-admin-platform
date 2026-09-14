import { Router } from "express";
import * as controller from "@/modules/clients/clients.controller";
import { authenticate } from "@/common/middleware/authenticate";
import { authorize } from "@/common/middleware/authorize";
import { validate } from "@/common/middleware/validate";
import { PERMISSIONS } from "@/common/constants/roles";
import { createClientSchema, idParamSchema, listClientsSchema, updateClientSchema } from "@/modules/clients/clients.validation";

const router = Router();
router.use(authenticate, authorize(PERMISSIONS.CLIENTS_MANAGE));

router.get("/", validate(listClientsSchema), controller.list);
router.get("/:id", validate(idParamSchema), controller.getById);
router.post("/", validate(createClientSchema), controller.create);
router.patch("/:id", validate(updateClientSchema), controller.update);

export default router;

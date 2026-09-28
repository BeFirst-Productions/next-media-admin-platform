import { Router } from "express";
import * as controller from "@/modules/leads/leads.controller";
import { authenticate } from "@/common/middleware/authenticate";
import { authorize } from "@/common/middleware/authorize";
import { validate } from "@/common/middleware/validate";
import { PERMISSIONS } from "@/common/constants/roles";
import {
  addLeadNoteSchema, assignLeadSchema, convertLeadSchema, createLeadSchema, idParamSchema, listLeadsSchema, updateLeadSchema,
} from "@/modules/leads/leads.validation";

const router = Router();
router.use(authenticate);

router.get("/", authorize(PERMISSIONS.LEADS_VIEW_OWN), validate(listLeadsSchema), controller.list);
router.get("/:id", authorize(PERMISSIONS.LEADS_VIEW_OWN), validate(idParamSchema), controller.getById);
router.post("/", authorize(PERMISSIONS.LEADS_MANAGE), validate(createLeadSchema), controller.create);
router.patch("/:id", authorize(PERMISSIONS.LEADS_MANAGE), validate(updateLeadSchema), controller.update);
router.post("/:id/convert", authorize(PERMISSIONS.LEADS_MANAGE), validate(convertLeadSchema), controller.convert);
router.post("/:id/assign", authorize(PERMISSIONS.LEADS_MANAGE), validate(assignLeadSchema), controller.assign);
router.post("/:id/notes", authorize(PERMISSIONS.LEADS_MANAGE), validate(addLeadNoteSchema), controller.addNote);
router.delete("/:id", authorize(PERMISSIONS.LEADS_MANAGE), validate(idParamSchema), controller.remove);

export default router;

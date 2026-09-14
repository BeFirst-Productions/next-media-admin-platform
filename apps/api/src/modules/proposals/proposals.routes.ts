import { Router } from "express";
import * as controller from "@/modules/proposals/proposals.controller";
import { authenticate } from "@/common/middleware/authenticate";
import { authorize } from "@/common/middleware/authorize";
import { validate } from "@/common/middleware/validate";
import { PERMISSIONS } from "@/common/constants/roles";
import {
  createProposalSchema, idParamSchema, listProposalsSchema, transitionSchema, updateProposalItemsSchema,
} from "@/modules/proposals/proposals.validation";

const router = Router();
router.use(authenticate);

router.get("/", authorize(PERMISSIONS.PROPOSALS_VIEW_OWN), validate(listProposalsSchema), controller.list);
router.get("/:id", authorize(PERMISSIONS.PROPOSALS_VIEW_OWN), validate(idParamSchema), controller.getById);
router.post("/", authorize(PERMISSIONS.PROPOSALS_CREATE), validate(createProposalSchema), controller.create);
router.put("/:id/items", authorize(PERMISSIONS.PROPOSALS_CREATE), validate(updateProposalItemsSchema), controller.updateItems);

router.post("/:id/submit", authorize(PERMISSIONS.PROPOSALS_CREATE), validate(transitionSchema), controller.submit);
router.post("/:id/review", authorize(PERMISSIONS.PROPOSALS_APPROVE), validate(transitionSchema), controller.review);
router.post("/:id/approve", authorize(PERMISSIONS.PROPOSALS_APPROVE), validate(transitionSchema), controller.approve);
router.post("/:id/reject", authorize(PERMISSIONS.PROPOSALS_APPROVE), validate(transitionSchema), controller.reject);
router.post("/:id/send-to-client", authorize(PERMISSIONS.PROPOSALS_APPROVE), validate(transitionSchema), controller.sendToClient);
router.post("/:id/client-accept", authorize(PERMISSIONS.PROPOSALS_APPROVE), validate(transitionSchema), controller.clientAccept);
router.post("/:id/cancel", authorize(PERMISSIONS.PROPOSALS_CREATE), validate(transitionSchema), controller.cancel);

export default router;

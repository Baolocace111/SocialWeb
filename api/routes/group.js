import express from "express";
import * as groupController from "../controllers/group.js";

const router = express.Router();

router.get('/:id', groupController.getGroupById);
router.get('/', groupController.getGroups);
router.post('/create', groupController.createGroup);

export default router;
import express from "express";
import * as groupController from "../controllers/group.js";

const router = express.Router();

router.get('/:id', groupController.getGroupById);
router.get('/', groupController.getGroups);

export default router;
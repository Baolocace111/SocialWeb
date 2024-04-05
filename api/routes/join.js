import express from "express";
import * as joinController from "../controllers/join.js";

const router = express.Router();

router.post('/join', joinController.createJoin);
router.delete('/', joinController.deleteJoin);
router.get('/groups/:groupId/users', joinController.getUsersByGroup);

export default router;
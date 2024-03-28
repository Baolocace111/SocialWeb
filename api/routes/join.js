import express from "express";
import * as joinController from "../controllers/join.js";

const router = express.Router();

router.post('/', joinController.createJoin);
router.delete('/', joinController.deleteJoin);

export default router;
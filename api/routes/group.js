import express from "express";
import * as groupController from "../controllers/group.js";

const router = express.Router();

router.get('/:groupId', groupController.getGroupById);
router.get('/', groupController.getGroups);
router.post('/create', groupController.createGroup);
router.put('/:groupId/update/avatar', groupController.updateGroupAvatarController);
router.get('/:groupId/avatar', groupController.getGroupAvatarController);
router.post('/search', groupController.searchGroupsController);
router.get('/:groupId/pending-posts', groupController.getPendingGroupPosts);
router.put('/:groupId/approve-post', groupController.approveGroupPost);
router.put('/:groupId/reject-post', groupController.rejectGroupPost);

export default router;
import express from "express";
import * as groupController from "../controllers/group.js";

const router = express.Router();

router.post("/create", groupController.createGroup);
router.post("/search", groupController.searchGroupsController);
router.get("/joined", groupController.getGroups);
router.get("/recommended-groups", groupController.getRecommendedGroupsController);
router.get("/:groupId", groupController.getGroupById);
router.put("/:groupId/update/avatar", groupController.updateGroupAvatarController);
router.get("/:groupId/avatar", groupController.getGroupAvatarController);
router.get("/:groupId/pending-posts", groupController.getPendingGroupPosts);
router.put("/:groupId/approve-post", groupController.approveGroupPost);
router.put("/:groupId/reject-post", groupController.rejectGroupPost);
router.get("/:groupId/pending-posts-count", groupController.getPendingPostsCount);
router.get("/:groupId/pending-requests-count", groupController.getJoinRequestsCount);
router.get("/:groupId/post-counts", groupController.getPostCounts);
router.get("/:groupId/postcounts", groupController.getPostCounts);
router.post("/:groupId/my-group-contents", groupController.getGroupPostsByStatus);

export default router;

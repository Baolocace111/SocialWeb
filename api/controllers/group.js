import * as groupService from "../services/GroupService.js";
import { AuthService } from "../services/AuthService.js";
import { upload } from "../Multer.js";
import path from "path";
import { normalBackgroundUser } from "./backgroundController.js";

export const getGroupById = async (req, res) => {
   try {
      const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

      AuthService.IsAccountBanned(userId, async (err, data) => {
         if (err) {
            return res.status(500).json({ error: "This account is banned" });
         }

         const groupId = req.params.groupId;
         groupService.getGroupById(groupId, userId, (err, data) => {
            if (err) return res.status(500).json({ error: err });
            return res.status(200).json(data);
         });
      });
   } catch (error) {
      return res.status(500).json(error);
   }
}

export const getGroups = async (req, res) => {
   try {
      const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

      AuthService.IsAccountBanned(userId, async (err, data) => {
         if (err) {
            return res.status(500).json({ error: "This account is banned" });
         }

         groupService.getGroups(userId, (err, data) => {
            if (err) return res.status(500).json({ error: err });
            return res.status(200).json(data);
         });
      });
   } catch (error) {
      return res.status(500).json(error);
   }
};

export const createGroup = async (req, res) => {
   try {
      const { group_name, privacy_level } = req.body;
      const createdBy = await AuthService.verifyUserToken(
         req.cookies.accessToken
      );

      AuthService.IsAccountBanned(createdBy, async (err, data) => {
         if (err) {
            return res.status(500).json({ error: "This account is banned" });
         }

         groupService.createGroup(
            group_name,
            privacy_level,
            createdBy,
            (err, data) => {
               if (err) return res.status(500).json({ error: err.message });
               return res
                  .status(201)
                  .json({ message: "Group created successfully", group: data });
            }
         );
      });
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

export const updateGroupAvatarController = async (req, res) => {
   try {
      const groupId = req.params.groupId;
      const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

      AuthService.IsAccountBanned(userId, async (err, data) => {
         if (err) {
            return res.status(500).json({ error: "This account is banned" });
         }

         upload(req, res, async (err) => {
            if (err) {
               return res.status(500).json(err);
            }

            if (!req.file) {
               return res.status(400).json({ message: "No file uploaded." });
            }

            const absolutePath = path.resolve(req.file.path);
            groupService.updateGroupAvatarService(
               userId,
               groupId,
               absolutePath,
               (err, data) => {
                  if (err) {
                     return res.status(500).json({ message: err });
                  }
                  return res.status(200).json({ message: data });
               }
            );
         });
      });
   } catch (error) {
      console.error(error);
      return res
         .status(500)
         .json({ message: "Error updating group avatar.", error: error });
   }
};

export const getGroupAvatarController = async (req, res) => {
   try {
      normalBackgroundUser(req, res, (error, userid) => {
         if (error) return res.status(500).json(error);
         groupService.getGroupAvatar(req.params.groupId, (error, data) => {
            if (error) return res.status(500).json(error);
            try {
               return res.sendFile(data);
            } catch (err) {
               return res.status(500).json(err);
            }
         });
      });
   } catch (error) {
      return res.status(500).json(error);
   }
};

export const searchGroupsController = async (req, res) => {
   try {
      const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
      AuthService.IsAccountBanned(userId, async (err, data) => {
         if (err) {
            return res.status(500).json({ error: "This account is banned" });
         }
         const searchText = req.body.searchText;
         groupService.getGroupsBySearchText(searchText, userId, (err, data) => {
            if (err) return res.status(500).json({ error: err });
            return res.status(200).json(data);
         });
      });
   } catch (error) {
      return res.status(500).json(error);
   }
};

export const getPendingGroupPosts = async (req, res) => {
   try {
      const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
      const { groupId } = req.params;
      const offset = Number(req.query.offset) || 1; // Thêm offset từ query

      AuthService.IsAccountBanned(userId, async (err, data) => {
         if (err) {
            return res.status(500).json({ error: "This account is banned" });
         }

         groupService.getPendingGroupPosts(
            userId,
            groupId,
            offset,
            (err, data) => {
               if (err) return res.status(500).json({ error: err.message });

               const next = data.length < 3 ? -1 : offset + 1;

               return res.status(200).json({ data, next });
            }
         );
      });
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

export const approveGroupPost = async (req, res) => {
   try {
      const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
      const { groupId } = req.params;
      const { postId } = req.body;

      if (!postId) {
         return res.status(400).json({ error: "Post ID is required" });
      }

      AuthService.IsAccountBanned(userId, async (err) => {
         if (err) {
            return res.status(500).json({ error: "This account is banned" });
         }

         groupService.approvePendingGroupPost(
            userId,
            groupId,
            postId,
            (err, result) => {
               if (err) return res.status(500).json({ error: err.message });
               return res.status(200).json(result);
            }
         );
      });
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

export const rejectGroupPost = async (req, res) => {
   try {
      const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
      const { groupId } = req.params;
      const { postId } = req.body;

      if (!postId) {
         return res.status(400).json({ error: "Post ID is required" });
      }

      AuthService.IsAccountBanned(userId, async (err) => {
         if (err) {
            return res.status(500).json({ error: "This account is banned" });
         }

         groupService.rejectPendingGroupPost(
            userId,
            groupId,
            postId,
            (err, result) => {
               if (err) return res.status(500).json({ error: err.message });
               return res.status(200).json(result);
            }
         );
      });
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
};

export const getPendingPostsCount = async (req, res) => {
   try {
      const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

      AuthService.IsAccountBanned(userId, async (err) => {
         if (err) {
            return res.status(500).json({ error: "This account is banned" });
         }

         const groupId = req.params.groupId;
         groupService.getPendingPostsCount(userId, groupId, (err, data) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.status(200).json({ count: data[0].pendingPostsCount });
         });
      });
   } catch (error) {
      return res.status(500).json(error);
   }
};

export const getJoinRequestsCount = async (req, res) => {
   try {
      const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

      AuthService.IsAccountBanned(userId, async (err) => {
         if (err) {
            return res.status(500).json({ error: "This account is banned" });
         }

         const groupId = req.params.groupId;
         groupService.getJoinRequestsCount(userId, groupId, (err, data) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.status(200).json({ count: data[0].joinRequestsCount });
         });
      });
   } catch (error) {
      return res.status(500).json(error);
   }
};

export const getPostCounts = (req, res) => {
   normalBackgroundUser(req, res, async (error, userId) => {
      if (error) {
         return res.status(500).json({ error: error.message });
      }
      const groupId = req.params.groupId;

      groupService.getPostCountsForUser(groupId, userId, (err, counts) => {
         if (err) {
            return res.status(500).json({ error: err.message });
         }
         return res.status(200).json(counts);
      });
   });
};

export const getGroupPostsByStatus = (req, res) => {
   const { groupId } = req.params;
   const { status } = req.body; // Nhận status từ body
   const offset = Number(req.query.offset) || 1; // Thêm offset từ query

   normalBackgroundUser(req, res, (err, userId) => {
      if (err) {
         return res.status(500).json({ error: "This account is banned" });
      }

      groupService.getUserGroupPostsByStatus(userId, groupId, status, offset, (err, data) => {
         if (err) return res.status(500).json({ error: err.message });

         const next = data.length < 3 ? -1 : offset + 1;

         return res.status(200).json({ data, next });
      });
   });
};


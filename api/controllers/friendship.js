import { AuthService } from "../services/AuthService.js";
import { checkFriendshipStatus } from "../services/FriendshipService.js";

export const getFriendshipStatus = async (req, res) => {
  try {
    const userId = AuthService.verifyUserToken(req.cookies.accessToken).id;
    const value = await checkFriendshipStatus(userId, req.query.friendId);
    const response = {
      value: value,
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

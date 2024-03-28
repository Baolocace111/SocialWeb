import * as groupService from "../services/GroupService.js";
import { AuthService } from "../services/AuthService.js";

export const getGroupById = async (req, res) => {
    try {
        const groupId = req.params.id;
        groupService.getGroupById(groupId, (err, data) => {
            if (err) return res.status(500).json({ error: err });
            return res.status(200).json(data);
        });
    } catch (error) {
        return res.status(500).json(error);
    }
}

export const getGroups = async (req, res) => {
    try {
        const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
        groupService.getGroups(userId, (err, data) => {
            if (err) return res.status(500).json({ error: err });
            return res.status(200).json(data);
        });
    } catch (error) {
        return res.status(500).json(error);
    }
}
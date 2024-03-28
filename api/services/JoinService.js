import * as joinModel from "../models/JoinModel.js";

export const createJoin = (req, res) => {
    const { userId, groupId } = req.body;
    joinModel.createUserJoin(userId, groupId, (err) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Joined the group successfully!" });
    });
}

export const deleteJoin = (req, res) => {
    const { userId, groupId } = req.body;
    joinModel.deleteUserJoin(userId, groupId, (err) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Left the group successfully!" });
    });
}
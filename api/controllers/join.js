import * as joinService from "../services/JoinService.js";
import { AuthService } from "../services/AuthService.js";

export const createJoin = async (req, res) => {
    try {
        const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

        AuthService.IsAccountBanned(userId, async (err, data) => {
            if (err) {
                return res.status(403).json({ message: "Your account is banned or invalid." });
            }

            const { groupId } = req.body;
            joinService.createJoin(userId, groupId, (err, response) => {
                if (err) return res.status(500).json({ error: err.message });
                return res.json(response);
            });
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const deleteJoin = async (req, res) => {
    try {
        const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

        AuthService.IsAccountBanned(userId, async (err, data) => {
            if (err) {
                return res.status(403).json({ message: "Your account is banned or invalid." });
            }

            const { groupId } = req.body;
            joinService.deleteJoin(userId, groupId, (err, response) => {
                if (err) return res.status(500).json({ error: err.message });
                return res.json(response);
            });
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getUsersByGroup = async (req, res) => {
    try {
        const userId = await AuthService.verifyUserToken(req.cookies.accessToken);

        AuthService.IsAccountBanned(userId, async (err, data) => {
            if (err) {
                return res.status(403).json({ message: "Your account is banned or invalid." });
            }

            const { groupId } = req.params;
            joinService.getUsersByGroup(groupId, (err, users) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                return res.json(users);
            });
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
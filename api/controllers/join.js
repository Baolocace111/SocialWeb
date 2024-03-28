import * as joinService from "../services/JoinService.js";

export const createJoin = (req, res) => {
    joinService.createJoin(req, res);
}

export const deleteJoin = (req, res) => {
    joinService.deleteJoin(req, res);
}
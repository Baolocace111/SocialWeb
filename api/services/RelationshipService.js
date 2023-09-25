import { getRelationships, addRelationship, deleteRelationship } from "../models/RelationshipModel.js";

export const getRelationshipsService = (followedUserId, callback) => {
  getRelationships(followedUserId, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};

export const addRelationshipService = (followerUserId, followedUserId, callback) => {
  addRelationship(followerUserId, followedUserId, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};

export const deleteRelationshipService = (followerUserId, followedUserId, callback) => {
  deleteRelationship(followerUserId, followedUserId, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
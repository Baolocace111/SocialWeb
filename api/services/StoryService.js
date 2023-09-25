import { getStories, addStory, deleteStory } from "../models/StoryModel.js";

export const getStoriesService = (userId, callback) => {
  getStories(userId, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};

export const addStoryService = (img, userId, callback) => {
  addStory(img, userId, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};

export const deleteStoryService = (storyId, userId, callback) => {
  deleteStory(storyId, userId, (err, data) => {
    if (err) return callback(err, null);
    return callback(null, data);
  });
};
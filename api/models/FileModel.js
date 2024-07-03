import { db } from "../connect.js";
export const FileOriginFileModel = (path, callback) => {
  if (!path || path === "") return callback("It's not a path", null);
  const formattedPath = path.replace(/\\/g, "\\");
  //console.log(formattedPath);
  const query = `
  SELECT 'comment' AS name, id FROM comments WHERE image = ?
  UNION ALL
  SELECT 'feedback' AS name, id FROM feedbacks WHERE img = ?
  UNION ALL
  SELECT 'post' AS name, id FROM posts WHERE img = ?
  UNION ALL
  SELECT 'story' AS name, id FROM stories WHERE img = ?
  UNION ALL
  SELECT 'group_avatar' AS name, id FROM teams WHERE group_avatar = ?
  UNION ALL
  SELECT 'coverPic' AS name, id FROM users WHERE coverPic = ?
  UNION ALL
  SELECT 'profilePic' AS name, id FROM users WHERE profilePic = ?
  UNION ALL
  SELECT 'message' AS name, id FROM messages WHERE image = ?
`;

  db.query(query, Array(8).fill(formattedPath), (err, result) => {
    if (err) return callback(err, null);

    if (result.length > 0) {
      return callback(null, result);
    } else {
      return callback("Could not found");
    }
  });
};

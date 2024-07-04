import { db } from "../connect.js";

export const createUserJoin = (userId, groupId, callback) => {
   const q = "INSERT INTO joins (user_id, group_id, joined_date, role) VALUES (?, ?, NOW(), 0)";
   db.query(q, [userId, groupId], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
   });
}

export const deleteUserJoin = (userId, groupId, callback) => {
   const queryCheckStatus = "SELECT status FROM joins WHERE user_id=? AND group_id=?";
   db.query(queryCheckStatus, [userId, groupId], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) {
         return callback(null, { message: "No join request found." });
      }

      const status = results[0].status;
      const message = status === 0 ? "Join request cancelled successfully!" : "Left the group successfully!";

      const queryDelete = "DELETE FROM joins WHERE user_id=? AND group_id=?";
      db.query(queryDelete, [userId, groupId], (err, deleteResults) => {
         if (err) return callback(err);
         return callback(null, { message: message });
      });
   });
};

export const getUsersByGroupId = (groupId, callback) => {
   const q = `
        SELECT u.id, u.username, u.email, u.name, u.coverPic, u.profilePic, j.role
        FROM users u
        INNER JOIN joins j ON u.id = j.user_id
        WHERE j.group_id = ? AND j.status = 1`;
   db.query(q, [groupId], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
   });
}

export const getJoinRequestsByGroupId = (groupId, callback) => {
   const query = `
        SELECT 
            joins.id, 
            joins.user_id,
            users.name, 
            users.profilePic, 
            users.create_at, 
            joins.joined_date 
        FROM 
            joins 
        INNER JOIN 
            users ON joins.user_id = users.id 
        WHERE 
            joins.group_id = ? AND 
            joins.status = 0
    `;

   db.query(query, [groupId], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
   });
};

export const getJoinRequestById = (joinRequestId, callback) => {
   const query = "SELECT * FROM joins WHERE id = ?";
   db.query(query, [joinRequestId], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null);
      return callback(null, results[0]);
   });
};

export const approveJoinRequest = (joinRequestId, callback) => {
   const q = "UPDATE joins SET status = 1 WHERE id = ?";
   db.query(q, [joinRequestId], (err, results) => {
      if (err) return callback(err);
      if (results.affectedRows === 0) {
         return callback(new Error("Join request not found or already approved!"));
      }
      return callback(null, results);
   });
};

export const checkIfUserIsGroupLeader = (userId, groupId, callback) => {
   const query = "SELECT * FROM teams WHERE id = ? AND created_by = ?";
   db.query(query, [groupId, userId], (err, results) => {
      if (err) return callback(err);
      if (results.length > 0) return callback(null, true);
      return callback(null, false);
   });
};

export const rejectJoinRequest = (joinRequestId, callback) => {
   const q = "DELETE FROM joins WHERE id = ? AND status = 0";
   db.query(q, [joinRequestId], (err, results) => {
      if (err) return callback(err);
      if (results.affectedRows === 0) {
         return callback(new Error("Join request not found or cannot be rejected!"));
      }
      return callback(null, results);
   });
};

export const checkIfUserIsInGroup = (userId, groupId, callback) => {
   const query = "SELECT * FROM joins WHERE user_id = ? AND group_id = ?";
   db.query(query, [userId, groupId], (err, results) => {
      if (err) return callback(err);
      if (results.length > 0) return callback(null, true);
      return callback(null, false);
   });
};

export const changeGroupLeader = (currentLeaderId, newLeaderId, groupId, callback) => {
   db.beginTransaction((err) => {
      if (err) return callback(err);

      const query1 = "UPDATE joins SET role = 0 WHERE user_id = ? AND group_id = ?";
      db.query(query1, [currentLeaderId, groupId], (err, results) => {
         if (err) {
            return db.rollback(() => {
               return callback(err);
            });
         }

         const query2 = "UPDATE joins SET role = 1 WHERE user_id = ? AND group_id = ?";
         db.query(query2, [newLeaderId, groupId], (err, results) => {
            if (err) {
               return db.rollback(() => {
                  return callback(err);
               });
            }

            const query3 = "UPDATE teams SET created_by = ? WHERE id = ?";
            db.query(query3, [newLeaderId, groupId], (err, results) => {
               if (err) {
                  return db.rollback(() => {
                     return callback(err);
                  });
               }

               db.commit((err) => {
                  if (err) {
                     return db.rollback(() => {
                        return callback(err);
                     });
                  }
                  return callback(null, { message: "Group leader changed successfully!" });
               });
            });
         });
      });
   });
};

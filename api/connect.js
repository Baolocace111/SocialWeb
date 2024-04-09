import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "vap.h.filess.io",
  user: "SocialDB_groundheld",
  password: "6b65e00d5a6fd32eaa87b471d49079fca39fa641",
  // host: "localhost",
  // user: "root",
  // password: "123456",
  database: "SocialDB_groundheld",
  multipleStatements: true,
  port: 3307,
});
//

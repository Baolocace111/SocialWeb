import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "mysql-15279f7f-baolocace111-787a.a.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_h9zmveuZ-RUOba6Y2M7",
  database: "social",
  port: 19664,
  // host: "localhost",
  // user: "root",
  // password: "123456",
  // database: "SocialDB_groundheld",
  multipleStatements: true,
  // port: 3307
});
//

import mysql from "mysql2";
const islocal = false;
export const db = mysql.createConnection({
  host: islocal
    ? "localhost"
    : "mysql-15279f7f-baolocace111-787a.a.aivencloud.com",
  user: islocal ? "root" : "avnadmin",
  password: islocal ? "123456" : "AVNS_h9zmveuZ-RUOba6Y2M7",
  database: "social",
  port: islocal ? 3307 : 19664,
  // host: "localhost",
  // user: "root",
  // password: "123456",

  multipleStatements: true,
  // port: 3307
});
//

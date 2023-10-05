import mysql from "mysql2"

export const db = mysql.createConnection({
  host:"webgameocto.cickmqk0vibg.ap-southeast-2.rds.amazonaws.com",
  user:"root",
  password:"sbnhizrhthorcecl",
  database:"social"
})
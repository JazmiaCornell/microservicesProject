const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// database connection - local
const db = mysql.createPool({
  connectionLimit: process.env.DB_CONN_LIMIT || 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  db.query(
    "INSERT INTO users (username, password, first_name, last_name, email) VALUES (?, ?, ?, ?, ?)",
    [username, password, first_name, last_name, email],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ username: username });
      }
    }
  );
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});

module.exports.db = db;

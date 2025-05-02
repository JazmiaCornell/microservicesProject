const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// database connection - local
const db = mysql.createPool({
  connectionLimit: process.env.DB_CONN_LIMIT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const saltRounds = 10;

app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      res.status(418).send(`Couldn't hash password.`);
    } else {
      db.query(
        "INSERT INTO users (username, password, first_name, last_name, email) VALUES (?, ?, ?, ?, ?)",
        [username, hashedPassword, first_name, last_name, email],
        (err, result) => {
          if (err) {
            res.status(418).send(`Couldn't register user.`);
          } else {
            res.send({ username: username });
          }
        }
      );
    }
  });
});

app.post("/signin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE username= ?",
    [username],
    (err, result) => {
      if (err) {
        res.status(418).send(err.message);
      } else if (result.length < 1) {
        res.status(418).send(`Username doesn't match.`);
      } else {
        bcrypt.compare(password, result[0].password, (err, match) => {
          if (match) {
            res.send({ username });
          }
          if (!match) {
            res.status(418).send(`Password doesn't match.`);
          }
        });
      }
    }
  );
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});

module.exports.db = db;

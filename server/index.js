// Citation Scope: Setting up Node app, connecting database, and implementing CRUD operations
// Date: 05/04/2025
// Originality: Adapted
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/

// Citation Scope: Implementation of cors for frontend to backend communication, bcrypt for password hashing
// Date: 05/04/2025
// Originality: Adapted
// Source: https://www.youtube.com/watch?v=dICDmbgGFdE&list=PLzF6FKB4VN3_8lYlLOsJI8hElGLRgUs7C
// Author: TechCheck

// Citation Scope: Setting up Stripe implementation for payments
// Date: 05/04/2025
// Originality: Adapted
// Source: https://docs.stripe.com/checkout/custom/quickstart

// Setup
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // using Stripe for donations/payments
const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt"); // used to hash password
const bodyParser = require("body-parser");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// database connection
const db = mysql.createPool({
  connectionLimit: process.env.DB_CONN_LIMIT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// sends donation data to donations Table to track donation made
app.post("/donations", async (req, res) => {
  const user_id = req.body.user_id;
  const amount = req.body.amount;
  const category = req.body.category;

  console.log(req.body);

  db.query(
    "INSERT INTO donations (donation_user_id, amount, donation_category) VALUES (?, ?, ?)",
    [user_id, amount, category],
    (err, result) => {
      if (err) {
        res.status(418).send("Couldn't add to database");
      } else {
        res.send("Successful donation.");
      }
    }
  );
});

// listener
app.listen(8080, () => {
  console.log("server listening on port 8080");
});

module.exports.db = db;

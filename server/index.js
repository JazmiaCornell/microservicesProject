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

const saltRounds = 10;

// requests data from users Table, passes username
app.get("/get-user/:username", (req, res) => {
  const { username } = req.params;
  console.log(`Fetching data for user: ${username}`);

  const query = "SELECT * FROM users WHERE username= ?";

  db.query(query, [username], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error retrieving user information" });
    }

    if (results.length > 0) {
      console.log(results);
      const user = results[0];
      return res.json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  });
});

// requests data from donations Table, passes userId
app.get("/donations", (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).send("User ID is required.");
  }

  db.query(
    "SELECT * FROM donations WHERE donation_user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching donations:", err);
        return res.status(500).send("Failed to fetch donations.");
      }
      res.json(results);
    }
  );
});

// requests data from users and donations Table, passes username
app.get("/dashboard/total-donations/:username", (req, res) => {
  const { username } = req.params;
  // gets user_id
  db.query(
    `
    SELECT user_id
    FROM users
    WHERE username = ?
  `,
    [username],
    (err, userRows) => {
      if (err) {
        console.error("Error fetching user ID:", err);
        return res.status(500).send("Error fetching user ID");
      }

      if (userRows.length === 0) {
        return res.status(404).send("User not found");
      }

      const userId = userRows[0].user_id;

      // gets sum of total donation aount for 2025
      db.query(
        `
      SELECT SUM(amount) AS total_donations
      FROM donations
      WHERE donation_user_id = ? AND YEAR(created_at) = 2025
    `,
        [userId],
        (err, donationRows) => {
          if (err) {
            console.error("Error fetching donations:", err);
            return res.status(500).send("Error fetching donations");
          }

          const totalDonations = donationRows[0].total_donations || 0;
          res.json({ total_donations: totalDonations });
        }
      );
    }
  );
});

// requests data from donations Table, passes username
app.get("/dashboard/recent-transactions/:username", (req, res) => {
  const { username } = req.params;

  const query = `
    SELECT donation_id, amount, payment_method, donation_category, status, created_at
    FROM donations
    JOIN users ON donation_user_id = user_id
    WHERE username = ? AND created_at >= CURDATE() - INTERVAL 1 MONTH
    ORDER BY created_at DESC
  `;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error fetching recent transactions:", err);
      return res.status(500).json({
        error: "An error occurred while fetching recent transactions",
      });
    }

    console.log(results);
    res.json(results);
  });
});

// sends data to Stripe for donation/payment
app.post("/create-payment-intent", async (req, res) => {
  const { amount, email } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PaymentIntent creation failed" });
  }
});

// sends data to users Table to add user
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

// sends data to users Table to update user
app.post("/profile", (req, res) => {
  const user_id = req.body.user_id;
  const username = req.body.username;
  const password = req.body.password;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const street = req.body.street;
  const city = req.body.city;
  const state = req.body.state;
  const postal_code = req.body.postal_code;

  console.log(req.body);

  if (password) {
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).send("Couldn't hash password.");
      }

      db.query(
        "UPDATE users SET username=?, password=?, first_name=?, last_name=?, email=?, street=?, city=?, state=?, postal_code=? WHERE user_id=?",
        [
          username,
          hashedPassword,
          first_name,
          last_name,
          email,
          street,
          city,
          state,
          postal_code,
          user_id,
        ],
        (err, result) => {
          if (err) {
            console.error("Error updating user:", err);
            return res.status(500).send("Failed to update profile.");
          }

          if (result.affectedRows === 0) {
            return res.status(404).send("User not found.");
          }

          res.send({ message: "Profile updated successfully" });
        }
      );
    });
  } else {
    db.query(
      "UPDATE users SET username=?, first_name=?, last_name=?, email=?, street=?, city=?, state=?, postal_code=? WHERE user_id=?",
      [
        username,
        first_name,
        last_name,
        email,
        street,
        city,
        state,
        postal_code,
        user_id,
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating user:", err);
          return res.status(500).send("Failed to update profile.");
        }

        if (result.affectedRows === 0) {
          return res.status(404).send("User not found.");
        }

        res.send({ message: "Profile updated successfully" });
      }
    );
  }
});

// sends data to users Table to confirm login
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

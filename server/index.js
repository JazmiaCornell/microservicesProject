require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
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

app.get("/get-user/:username", (req, res) => {
  const { username } = req.params;
  console.log(`Fetching data for user: ${username}`);

  // First query: Retrieve user information
  const query = "SELECT * FROM users WHERE username= ?";

  db.query(query, [username], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error retrieving user information" });
    }

    if (results.length > 0) {
      console.log(results);
      const user = results[0]; // Assuming username is unique
      return res.json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  });
});

app.get("/donations", (req, res) => {
  const userId = req.query.userId; // Retrieve userId from the query parameter

  if (!userId) {
    return res.status(400).send("User ID is required.");
  }

  db.query(
    "SELECT * FROM donations WHERE donation_user_id = ?",
    [userId], // Passing userId as a parameter to avoid SQL injection
    (err, results) => {
      if (err) {
        console.error("Error fetching donations:", err);
        return res.status(500).send("Failed to fetch donations.");
      }
      res.json(results);
    }
  );
});

app.get("/dashboard/total-donations/:username", (req, res) => {
  const { username } = req.params;
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

      // Now fetch the total donations for 2025 for the specific user
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

app.get("/dashboard/recent-transactions/:username", (req, res) => {
  const { username } = req.params;

  // SQL query to fetch recent donations for the user
  const query = `
    SELECT donation_id, amount, payment_method, donation_category, status, created_at
    FROM donations
    JOIN users ON donation_user_id = user_id
    WHERE username = ? AND created_at >= CURDATE() - INTERVAL 1 MONTH
    ORDER BY created_at DESC
  `;

  // Execute the query
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error fetching recent transactions:", err);
      return res.status(500).json({
        error: "An error occurred while fetching recent transactions",
      });
    }

    // Send the results back to the client
    console.log(results);
    res.json(results);
  });
});

app.post("/create-payment-intent", async (req, res) => {
  const { amount, email } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in cents
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

app.post("/donations", async (req, res) => {
  // combinedResults.user_id
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

app.listen(8080, () => {
  console.log("server listening on port 8080");
});

module.exports.db = db;

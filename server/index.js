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
  const query =
    "SELECT user_id, first_name, last_name, email FROM users WHERE username= ?";

  db.query(query, [username], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error retrieving user information" });
    }

    console.log(results);

    if (results.length > 0) {
      const user = results[0]; // Get user info from the first query
      console.log(user.user_id);

      const addressQuery = "SELECT * FROM addresses WHERE user_id = ?";

      db.query(addressQuery, [user.user_id], (err, addressResults) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error retrieving user address" });
        }

        if (addressResults.length > 0) {
          const address = addressResults[0]; // Get address from the second query

          // Combine the user information with the address
          const combinedResult = {
            ...user,
            address: address, // Add the address to the response
          };

          console.log(combinedResult);
          return res.json(combinedResult); // Send the combined data as a response
        } else {
          // no address found
          return res.json(user);
        }
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
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

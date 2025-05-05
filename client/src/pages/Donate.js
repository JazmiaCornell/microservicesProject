import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// References: Stripe API - embedded component

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const username = useSelector((state) => state.auth.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [user_id, setUserId] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log(username);
    if (username) {
      axios
        .get(`http://localhost:8080/get-user/${username}`)
        .then((response) => {
          const data = response.data;
          const fullName = `${data.first_name} ${data.last_name}`;
          setName(fullName);
          setEmail(data.email);
          setUserId(data.user_id);
          setStreet(data.street);
          setCity(data.city);
          setState(data.state);
          setPostalCode(data.postal_code);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setMessage("Could not retrieve user data.");
        });
    }
  }, [username]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setName("");
    setEmail("");
    setAmount("");
    setCategory("");
    setStreet("");
    setCity("");
    setState("");
    setPostalCode("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          email,
          name,
          category,
          billingAddress: { street, city, state, postalCode },
        }),
      });

      const { clientSecret } = await res.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name,
            email,
            address: { line1: street, city, state, postal_code: postalCode },
          },
        },
      });

      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setMessage("Donation successful! Thank you!");
        const donation = {
          user_id,
          amount,
          category,
        };

        // Send the data to your backend to save it in the database
        await fetch("http://localhost:8080/donations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(donation),
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred during payment.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={submitHandler}
      className="mx-auto border-2 p-6 md:p-8 w-full max-w-xl border-gray-400 mt-10 h-auto"
    >
      <h2 className="pb-6 text-3xl md:text-6xl text-center text-black font-poppins font-medium">
        Make a Donation
      </h2>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-black"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-black"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full px-4 py-2 border border-black"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Donation Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-2 border border-black"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Street Address</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
            className="w-full px-4 py-2 border border-black"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full px-4 py-2 border border-black"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            className="w-full px-4 py-2 border border-black"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Postal Code</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
            className="w-full px-4 py-2 border border-black"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Card Details</label>
        <div className="p-4 border border-black">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>

      <div className="flex justify-center space-x-8 mt-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-1/2 px-3 py-1 bg-red-400 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-1/2 px-3 py-1 bg-blue1 bg-400 text-white rounded hover:bg-gray-600"
        >
          {loading ? "Processing..." : "Donate"}
        </button>
      </div>

      {message && (
        <p className="mt-4 text-center text-red-600 font-medium">{message}</p>
      )}
    </form>
  );
};

const Donate = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Donate;

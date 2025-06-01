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

// Citation Scope: Implementation of React, Redux, and Axios
// Date: 05/04/2025
// Originality: Adapted
// Source: https://www.youtube.com/watch?v=dICDmbgGFdE&list=PLzF6FKB4VN3_8lYlLOsJI8hElGLRgUs7C
// Author: TechCheck

// Citation Scope: Implementation of Stripe API
// Date: 05/04/2025
// Originality: Adapted
// Source: https://docs.stripe.com/checkout/custom/quickstart

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY); // public key

const CheckoutForm = () => {
  // stripe elements
  const stripe = useStripe();
  const elements = useElements();

  // used for redirection
  const navigate = useNavigate();

  // state from redux
  const username = useSelector((state) => state.auth.user);
  const user_id = useSelector((state) => state.auth.user_id);

  // states for donation form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // additional states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log(user_id);
    if (user_id) {
      // requests user data
      axios
        .get(`http://localhost:8088/get-user/${user_id}`)
        .then((response) => {
          const data = response.data;
          const fullName = `${data.first_name} ${data.last_name}`;
          setName(fullName);
          setEmail(data.email);
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
  }, [user_id]);

  // form submission handler
  const submitHandler = async (e) => {
    // prevent default
    e.preventDefault();
    setLoading(true);

    // clears form
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
      // request to stripe to complete payment
      const res = await fetch("http://localhost:8089/create-payment-intent", {
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

      // clientSecret from Stripe
      const { clientSecret } = await res.json();

      // confirmation of payment
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

      // sends confirmation if successful, else sends error message
      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setMessage("Donation successful! Thank you!");
        const donation = {
          user_id,
          amount,
          category,
        };
        const formData = {
          name,
          email,
          amount,
          category,
          street,
          city,
          state,
          postalCode,
        };

        if (user_id) {
          // Send the data to your backend to save it in the database
          await fetch("http://localhost:8081/donations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(donation),
          });
        }

        const res = await fetch("http://localhost:5013/receipt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await res.json();
        console.log(result.message);

        setTimeout(() => {
          // redirects to homepage
          navigate("/dashboard");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred during payment.");
    }

    setLoading(false);
  };

  return (
    // Donation form
    <form
      onSubmit={submitHandler}
      className="mx-auto border-2 p-6 md:p-8 w-full max-w-xl border-gray-400 mt-10 h-auto"
    >
      <h2 className="pb-6 text-3xl md:text-6xl text-center text-black font-poppins font-medium">
        Make a Donation
      </h2>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Name Input */}
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
        {/* Amount Input */}
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
        {/* Category Input */}
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
        {/* Address Input */}
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
        {/* City Input */}
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
        {/* State Input */}
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
        {/* Postal Code Input */}
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

      {/* Card Input */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Card Details</label>
        <div className="p-4 border border-black">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>

      {/* Buttons */}
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

// Wrapper for Stripe Element
const Donate = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Donate;

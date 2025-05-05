import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../store/authSlice";
import { Link, Navigate } from "react-router-dom";

// Citation Scope: Implementation of React, Redux, React-Router
// Date: 05/04/2025
// Originality: Adapted
// Source: https://www.youtube.com/watch?v=dICDmbgGFdE&list=PLzF6FKB4VN3_8lYlLOsJI8hElGLRgUs7C
// Author: TechCheck

function Signup() {
  // states for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // access states from redux
  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();

  // form submission handler
  const submitHandler = (e) => {
    // prevent default
    e.preventDefault();

    // dispatch signup action
    dispatch(signup({ username, password, first_name, last_name, email })).then(
      (res) => {
        console.log(res);

        // clears form
        setFirstName("");
        setLastName("");
        setEmail("");
        setUsername("");
        setPassword("");
      }
    );
  };

  return (
    <div>
      {/* Signup form */}
      <form
        className="mx-auto border-2 p-6 md:p-8 w-full max-w-xl border-gray-400 mt-20 h-auto"
        onSubmit={submitHandler}
      >
        <h3 className="pb-6 text-4xl md:text-6xl text-center text-black font-poppins font-medium">
          Sign Up
        </h3>
        <p className="text-center mb-3">
          Already Registered?{" "}
          <Link to="/signin" className="hover:underline">
            Sign In
          </Link>
        </p>
        {/* Name Inputs */}
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label className="block mb-1 text-lg" htmlFor="first_name">
              First Name
            </label>
            <input
              className="w-full p-2 border border-black border-300 focus:outline-none"
              id="first_name"
              type="text"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1 text-lg" htmlFor="last_name">
              Last Name
            </label>
            <input
              className="w-full p-2 border border-black border-300 focus:outline-none"
              id="last_name"
              type="text"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        {/* Email Input */}
        <label className="block mb-1 text-lg" htmlFor="email">
          Email
        </label>
        <input
          className="w-full p-2 mb-4 focus:outline-none border border-black border-300"
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* Username Input */}
        <label className="block mb-1 text-lg" htmlFor="username">
          Username
        </label>
        <input
          className="w-full p-2 mb-4 focus:outline-none border border-black border-300"
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* Password Input */}
        <label className="block mb-1 text-lg" htmlFor="password">
          Password
        </label>
        <input
          className="w-full p-2 mb-4 focus:outline-none border border-black border-300"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Buttons */}
        <div className="flex justify-center space-x-8 mt-4">
          <button className="w-1/2 px-3 py-1 bg-red-400" type="button">
            Cancel
          </button>
          <button
            className="w-1/2 px-3 py-1 bg-blue1 bg-400 text-white"
            type="submit"
          >
            Sign Up
          </button>
        </div>
        {/* If failure, sends error */}
        {error ? (
          <p className="pt-10 text-center text-red-600">{error}</p>
        ) : null}
        {/* If success, sends user to dashboard */}
        {user ? <Navigate to="/dashboard" replace={true} /> : null}
      </form>
      <p className="text-center py-3">
        Become a part of our community and easily track the good you give.
      </p>
    </div>
  );
}

export default Signup;

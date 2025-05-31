import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "../store/authSlice";
import { Link, useNavigate } from "react-router-dom";

// Citation Scope: Implementation of React, Redux, React-Router
// Date: 05/04/2025
// Originality: Adapted
// Source: https://www.youtube.com/watch?v=dICDmbgGFdE&list=PLzF6FKB4VN3_8lYlLOsJI8hElGLRgUs7C
// Author: TechCheck

function Signin() {
  // states for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // access states from redux
  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // form submission handler
  const submitHandler = (e) => {
    // prevent default
    e.preventDefault();

    // dispatch signup action
    dispatch(signin({ username, password })).then((res) => {
      if (!res.error) {
        console.log(res.payload);

        // clears form after submission
        setUsername("");
        setPassword("");
        navigate("/dashboard");
      } else {
        console.log("Login failed:", res.error.message);
      }
    });
  };

  return (
    <div>
      {/* Signin form */}
      <form
        className="mx-auto border-2 p-6 md:p-8 w-full max-w-xl border-gray-400 mt-24 h-auto"
        onSubmit={submitHandler}
      >
        <h3 className="pb-6 text-4xl md:text-6xl text-center text-black font-poppins font-medium">
          Sign In
        </h3>
        <p className="text-center mb-3">Sign in to your account</p>
        {/* Username input */}
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
        {/* Password input */}
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
        {/* Button */}
        <div className="flex justify-center space-x-8 mt-4">
          <button
            className="w-1/2 px-3 py-1 bg-blue1 bg-400 text-white"
            type="submit"
          >
            Sign In
          </button>
        </div>
        {/* If failure, sends error */}
        {error ? (
          <p className="pt-10 text-center text-red-600">{error}</p>
        ) : null}
        {/* If success, sends user to dashboard */}
      </form>
      <p className="text-center py-3">
        Not a member?{" "}
        <Link to="/signup" className="hover:underline">
          Create a new account
        </Link>
      </p>
    </div>
  );
}

export default Signin;

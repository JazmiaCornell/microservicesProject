import { use, useState } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // data will be the string we send from our server
  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/signup", {
        username: username,
        password: password,
        first_name: first_name,
        last_name: last_name,
        email: email,
      })
      .then((data) => {
        console.log(data);
        setFirstName("");
        setLastName("");
        setEmail("");
        setUsername("");
        setPassword("");
      });
  };

  return (
    <div>
      <form
        className="mx-auto border-2 p-6 md:p-8 w-full max-w-xl border-gray-400 mt-24 h-auto"
        onSubmit={submitHandler}
      >
        <h3 className="pb-6 text-4xl md:text-6xl text-center text-black font-poppins font-medium">
          Sign Up
        </h3>
        <p className="text-center mb-3">Already Registered? Login</p>
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
      </form>
      <p className="text-center py-3">
        Become a part of our community and easily track the good you give.
      </p>
    </div>
  );
}

export default App;

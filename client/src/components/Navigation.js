import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

// Citation Scope: Implementation of React, Redux, and React-Router
// Date: 05/04/2025
// Originality: Adapted
// Source: https://www.youtube.com/watch?v=dICDmbgGFdE&list=PLzF6FKB4VN3_8lYlLOsJI8hElGLRgUs7C
// Author: TechCheck

export default function Navigation() {
  // status from redux
  const loggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  // tracks sizing for mobile device
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full py-4 border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex-grow">
          <div
            className={`flex items-center justify-between ${
              menuOpen ? "" : "border border-black rounded-full px-6 py-2"
            }`}
          >
            <Link to="/" className="text-xl font-medium font-heading mr-4">
              Nazareth
            </Link>

            {/* Mobile Navbar */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            {/* Navbar */}
            <ul
              className={`flex-col md:flex md:flex-row md:space-x-10 text-lg space-y-4 md:space-y-0 md:ml-10 ${
                menuOpen ? "flex mt-4" : "hidden"
              } md:flex`}
            >
              <li>
                <Link
                  className="hover:underline"
                  to="/"
                  onClick={() => setMenuOpen(false)}
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link
                  className="hover:underline"
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                >
                  ABOUT
                </Link>
              </li>
              <li>
                <Link
                  className="hover:underline"
                  to="/donate"
                  onClick={() => setMenuOpen(false)}
                >
                  DONATE
                </Link>
              </li>
              {/* If logged in, shows additional links */}
              {loggedIn && (
                <>
                  <li>
                    <Link
                      className="hover:underline"
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                    >
                      DASHBOARD
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:underline"
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                    >
                      PROFILE
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:underline"
                      to="/donations"
                      onClick={() => setMenuOpen(false)}
                    >
                      DONATIONS
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div className="hidden md:flex items-center space-x-4 pl-6">
          {loggedIn ? (
            <>
              <Link to="/dashboard">
                <button className="px-4 py-2 rounded-md border text-white bg-blue1">
                  WELCOME
                </button>
              </Link>
              <Link to="/" onClick={() => dispatch(logout())}>
                <button className="px-4 py-2 rounded-md border text-white bg-blue1">
                  SIGN OUT
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/signin">
                <button className="px-4 py-2 rounded-md border text-white bg-blue1">
                  SIGN IN
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-4 py-2 rounded-md border text-white bg-blue1">
                  SIGN UP
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Buttons */}
      {menuOpen && (
        <div className="md:hidden mt-4 px-6 space-y-2">
          {loggedIn ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                <button className="w-full px-4 py-2 rounded-md border text-white bg-blue1">
                  WELCOME
                </button>
              </Link>
              <Link
                to="/"
                onClick={() => {
                  dispatch(logout());
                  setMenuOpen(false);
                }}
              >
                <button className="w-full px-4 py-2 rounded-md border text-white bg-blue1">
                  SIGN OUT
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/signin" onClick={() => setMenuOpen(false)}>
                <button className="w-full px-4 py-2 rounded-md border text-white bg-blue1">
                  SIGN IN
                </button>
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                <button className="w-full px-4 py-2 rounded-md border text-white bg-blue1">
                  SIGN UP
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

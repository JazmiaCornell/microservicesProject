import cross from "./images/cross.jpg"; // import image
import { Link } from "react-router-dom";
import Popup from "./pages/Popup";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// Citation Scope: Implementation redux for user authentication/session, specifically tracking if user is logged in with useSlector
// Date: 05/04/2025
// Originality: Adapted
// Source: https://www.youtube.com/watch?v=x4H3HYPx3yQ&list=PLzF6FKB4VN3_8lYlLOsJI8hElGLRgUs7C&index=5
// Author: TechCheck

function App() {
  // state for popup
  const [isPopup, setIsPopup] = useState("");
  // state from redux
  const loggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    // shows popup when homepage is loaded
    if (!loggedIn) {
      const seenPopup = localStorage.getItem("seenPopup");
      if (!seenPopup) {
        setIsPopup(true);
      }
    }
  }, [loggedIn]);

  // function to close popup
  const closePopup = () => {
    setIsPopup(false);
    localStorage.setItem("seenPopup", true);
  };

  return (
    <section className="relative min-h-screen bg-white px-4 sm:px-10 pt-10">
      <div className="relative w-full max-w-7xl mx-auto h-[90vh] sm:h-[90vh]">
        {/* image of cross in sky */}
        <img
          src={cross}
          alt="Cross with sky"
          className="w-full h-full object-cover rounded-xl shadow-xl"
        />

        <div className="absolute top-10 sm:top-20 right-4 sm:right-20 left-4 sm:left-auto max-w-xl mx-auto sm:mx-0 text-center sm:text-left">
          <h1 className="text-4xl sm:text-7xl font-extrabold font-heading leading-tight">
            Welcome to
            <br />
            Nazareth
          </h1>
          {/* shows popup to new users */}
          {!loggedIn && isPopup && <Popup onClose={closePopup} />}
          <p className="mt-2 text-lg sm:text-xl text-800">
            Where the feast of the Lord is going on.
          </p>
          {/* Button redirects to about page */}
          <Link to="/about">
            <button className="mt-4 px-6 py-3 text-800 bg-white hover:bg-gray-200 hover:underline font-semibold rounded-md shadow w-full sm:w-auto">
              LEARN MORE
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default App;

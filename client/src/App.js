import cross from "./images/cross.jpg";
import { Link } from "react-router-dom";

function App() {
  return (
    <section className="relative h-screen bg-white px-10 pt-10">
      <div className="relative w-[90%] h-[90%] mx-auto">
        <img
          src={cross}
          alt="Cross with sky"
          className="w-full h-full object-cover rounded-xl shadow-xl"
        />

        <div className="absolute top-20 right-20 z-10 max-w-xl text-center">
          <h1 className="text-7xl font-extrabold font-heading leading-tight">
            Welcome to
            <br />
            Nazareth
          </h1>
          <p className="mt-2 text-xl text-800">
            Where the feast of the Lord is going on.
          </p>
          <Link to="/about">
            <button className="mt-4 px-6 py-3 text-800 bg-white hover:bg-gray-200 hover:underline font-semibold rounded-md shadow">
              LEARN MORE
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default App;

import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="flex justify-between w-full items-center h-16 mt-2 mx-2 py-2 px-0 mb-5">
      <div className="flex w-3/4 items-center border border-black rounded-full px-6 py-2 space-x-10 ml-2">
        <Link
          to="/"
          className="text-xl font-medium font-heading flex justify-start"
        >
          Nazareth
        </Link>
        <ul className="absolute left-1/2 transform -translate-x-1/2 flex text-lg">
          <li>
            <Link className="pl-10 hover:underline" to="/">
              HOME
            </Link>
          </li>
          <li>
            <Link className="pl-10 hover:underline" to="/about">
              ABOUT
            </Link>
          </li>
          <li>
            <Link className="pl-10 hover:underline" to="/donate">
              DONATE
            </Link>
          </li>
        </ul>
      </div>
      <ul className="flex items-center space-x-4 justify-end w-1/4 pr-20">
        <li>
          <Link to="/signin">
            <button className="px-4 py-2 rounded-md border text-white bg-blue1">
              SIGN IN
            </button>
          </Link>
        </li>
        <li>
          <Link to="/signup">
            <button className="px-4 py-2 rounded-md border text-white bg-blue1">
              SIGN UP
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

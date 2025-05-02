import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

export default function Navigation() {
  const loggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  return (
    <nav className="w-full py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        <div className="flex-grow flex items-center border border-black rounded-full px-6 py-2 space-x-10">
          <Link to="/" className="text-xl font-medium font-heading">
            Nazareth
          </Link>
          <ul className="flex space-x-10 text-lg">
            <li>
              <Link className="hover:underline" to="/">
                HOME
              </Link>
            </li>
            <li>
              <Link className="hover:underline" to="/about">
                ABOUT
              </Link>
            </li>
            <li>
              <Link className="hover:underline" to="/donate">
                DONATE
              </Link>
            </li>
            {loggedIn && (
              <>
                <li>
                  <Link className="hover:underline" to="/dashboard">
                    DASHBOARD
                  </Link>
                </li>
                <li>
                  <Link className="hover:underline" to="/donations">
                    DONATIONS
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Auth buttons on right */}
        <div className="flex items-center space-x-4 pl-6">
          {loggedIn ? (
            <>
              <Link to="/dashboard">
                <button className="px-4 py-2 rounded-md border text-white bg-blue1">
                  CIRCLE
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
    </nav>
  );
}

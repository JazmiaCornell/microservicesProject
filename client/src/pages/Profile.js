import React, { useState, useEffect } from "react";
import axios from "axios";
import { submitProfile } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HelpDropdown from "./HelpDropdown";

function Profile() {
  const username = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [originalProfile, setOriginalProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    if (username) {
      setLoading(true);
      axios
        .get(`http://localhost:8080/get-user/${username}`)
        .then((response) => {
          const data = response.data;
          setUserId(data.user_id);
          setUser(data.username);
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setEmail(data.email);
          setStreet(data.street || "");
          setCity(data.city || "");
          setState(data.state || "");
          setPostalCode(data.postal_code || "");
          setOriginalProfile({ ...data });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [username]);

  const submitHandler = (e) => {
    e.preventDefault();
    setIsPopupVisible(true);
  };

  const handleConfirmSave = () => {
    setLoading(true);

    // Prepare the profile data for submission
    const updatedProfile = {
      user_id: userId,
      username: user,
      first_name: firstName,
      last_name: lastName,
      email,
      street,
      city,
      state,
      postal_code: postalCode,
    };

    // Only include the password if it's changed
    if (password !== originalProfile.password) {
      updatedProfile.password = password;
    }

    dispatch(submitProfile(updatedProfile))
      .then((res) => {
        console.log("Profile updated:", res);
        navigate("/dashboard");
      })
      .finally(() => setLoading(false));

    // Close the popup after submission
    setIsPopupVisible(false);
  };

  const handleCancelPopup = () => {
    setIsPopupVisible(false);
  };

  const cancelEdit = () => {
    setUser(originalProfile.username || "");
    setPassword(originalProfile.password || "");
    setFirstName(originalProfile.first_name || "");
    setLastName(originalProfile.last_name || "");
    setEmail(originalProfile.email || "");
    setStreet(originalProfile.street || "");
    setCity(originalProfile.city || "");
    setState(originalProfile.state || "");
    setPostalCode(originalProfile.postal_code || "");
    setIsEditable(false);
  };

  return (
    <div>
      <HelpDropdown />
      <form
        className="mx-auto max-w-5xl border-2 p-6 md:p-8 w-full max-w-xl border-gray-400 mt-10 h-auto space-y-4"
        onSubmit={submitHandler}
      >
        <h3 className="pb-6 text-4xl md:text-6xl text-center text-black font-medium">
          Edit Profile
        </h3>

        {error && <p className="text-center text-red-500">{error}</p>}

        <label className="block mb-1 text-lg">Username</label>
        <input
          className="w-full p-2 mb-4 border border-black focus:outline-none"
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          disabled={!isEditable || loading}
        />

        <label className="block mb-1 text-lg">Password</label>
        <input
          className="w-full p-2 mb-4 border border-black focus:outline-none"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!isEditable || loading}
        />

        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label className="block mb-1 text-lg">First Name</label>
            <input
              className="w-full p-2 border border-black focus:outline-none"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!isEditable || loading}
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1 text-lg">Last Name</label>
            <input
              className="w-full p-2 border border-black focus:outline-none"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!isEditable || loading}
            />
          </div>
        </div>

        <label className="block mb-1 text-lg">Email</label>
        <input
          className="w-full p-2 mb-4 border border-black focus:outline-none"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!isEditable || loading}
        />

        <label className="block mb-1 text-lg">Street</label>
        <input
          className="w-full p-2 mb-4 border border-black focus:outline-none"
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          disabled={!isEditable || loading}
        />

        <div className="flex space-x-4 mb-4">
          <div className="w-1/3">
            <label className="block mb-1 text-lg">City</label>
            <input
              className="w-full p-2 border border-black focus:outline-none"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!isEditable || loading}
            />
          </div>
          <div className="w-1/3">
            <label className="block mb-1 text-lg">State</label>
            <input
              className="w-full p-2 border border-black focus:outline-none"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              disabled={!isEditable || loading}
            />
          </div>
          <div className="w-1/3">
            <label className="block mb-1 text-lg">Postal Code</label>
            <input
              className="w-full p-2 border border-black focus:outline-none"
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              disabled={!isEditable || loading}
            />
          </div>
        </div>

        <div className="flex justify-center space-x-8 mt-6">
          {!isEditable ? (
            <button
              type="button"
              className="w-full px-3 py-2 bg-blue1 text-white"
              onClick={() => setIsEditable(true)}
            >
              Edit
            </button>
          ) : (
            <>
              <button
                type="button"
                className="w-1/2 px-3 py-2 bg-red-400 text-white"
                onClick={cancelEdit}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 px-3 py-2 bg-blue1 text-white"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </form>
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96 text-center">
            <p className="text-lg mb-4">
              Are you sure you want to save the changes?
            </p>
            <div className="flex justify-around">
              <button
                className="px-4 py-2 bg-red-400 text-white rounded-md"
                onClick={handleCancelPopup}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue1 text-white rounded-md"
                onClick={handleConfirmSave}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;

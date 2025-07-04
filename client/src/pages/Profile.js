import React, { useState, useEffect } from "react";
import axios from "axios";
import { submitProfile, fetchProfile, logout } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HelpDropdown from "./HelpDropdown";

// Citation Scope: Implementation of React, Redux, React-Router
// Date: 05/04/2025
// Originality: Adapted
// Source: https://www.youtube.com/watch?v=dICDmbgGFdE&list=PLzF6FKB4VN3_8lYlLOsJI8hElGLRgUs7C
// Author: TechCheck

const usersApi = process.env.REACT_APP_USERS_API;

function Profile() {
  // get states from redux
  const user_id = useSelector((state) => state.auth.user_id);
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // states for form inputs
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // states to manage form
  const [originalProfile, setOriginalProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isDeletePopupVisible, setDeletePopupVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    // fetch user's current profile, passing user_id
    if (user_id) {
      setLoading(true);
      axios
        .get(`${usersApi}/${user_id}`)
        .then((response) => {
          const data = response.data;

          // add user information to form with returned data
          setUser(data.username);
          setPassword(data.password || "");
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setEmail(data.email);
          setStreet(data.street || "");
          setCity(data.city || "");
          setState(data.state || "");
          setPostalCode(data.postal_code || "");
          setOriginalProfile({ ...data });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    }
  }, [user_id]);

  // form submission handler
  const submitHandler = (e) => {
    // prevent default
    e.preventDefault();

    // shows confirmation popup
    setIsPopupVisible(true);
  };

  // final confirmation to submite form
  const handleConfirmSave = async () => {
    setLoading(true);

    // Prepare the profile data for submission
    const updatedProfile = {
      user_id,
      username: user,
      first_name: firstName,
      last_name: lastName,
      email,
      street,
      city,
      state,
      postal_code: postalCode,
    };

    // checks if password was changed, doesn't send if not
    if (password !== originalProfile.password) {
      updatedProfile.password = password;
    }

    // dispatch profile actions
    const res = await dispatch(submitProfile(updatedProfile));
    console.log("Profile updated:", res.payload);

    await dispatch(fetchProfile(user_id));
    navigate("/dashboard");
    setLoading(false);

    // Closes popup
    setIsPopupVisible(false);
  };

  // cancel action
  const handleCancelPopup = () => {
    setIsPopupVisible(false);
    setDeletePopupVisible(false);
  };

  // delete action
  const handleDeletePopup = () => {
    setDeletePopupVisible(true);
  };

  // reverts changes to form/fields
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

  const handleConfirmDelete = async () => {
    console.log("Delete confirmed");
    try {
      await axios.delete(`${userApi}/delete-user/${user_id}`);
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.log("Error deleting account:", error);
    }
  };

  return (
    <div>
      {/* Help Dropdown component */}
      <HelpDropdown />

      {/* Edit Profile form */}
      <form
        className="mx-auto max-w-5xl border-2 p-6 md:p-8 w-full max-w-xl border-gray-400 mt-10 h-auto space-y-4"
        onSubmit={submitHandler}
      >
        <h3 className="pb-6 text-4xl md:text-6xl text-center text-black font-medium">
          Edit Profile
        </h3>

        {/* displays error message */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Username input */}
        <label className="block mb-1 text-lg">Username</label>
        <input
          className="w-full p-2 mb-4 border border-black focus:outline-none"
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          disabled={!isEditable || loading}
        />

        {/* Password input */}
        <label className="block mb-1 text-lg">Password</label>
        <input
          className="w-full p-2 mb-4 border border-black focus:outline-none"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!isEditable || loading}
        />

        {/* Name input */}
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

        {/* Email input */}
        <label className="block mb-1 text-lg">Email</label>
        <input
          className="w-full p-2 mb-4 border border-black focus:outline-none"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!isEditable || loading}
        />

        {/* Billing address inputs */}
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

        {/* Cancel and Submit Buttons */}
        <div className="flex justify-center space-x-8 mt-6">
          {!isEditable ? (
            <>
              <button
                type="button"
                className="w-full px-3 py-2 bg-blue1 text-white"
                onClick={() => setIsEditable(true)}
              >
                Edit
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 bg-red-400 text-white"
                onClick={handleDeletePopup}
              >
                Delete
              </button>
            </>
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

      {/* Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96 text-center">
            <p className="text-lg mb-4">
              Are you sure you want to save the changes?
            </p>
            {/* Popup Buttons */}
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
      {isDeletePopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96 text-center">
            <p className="text-lg mb-4">
              Are you sure you want to permanently delete your account?
            </p>
            {/* Popup Buttons */}
            <div className="flex justify-around">
              <button
                className="px-4 py-2 bg-red-400 text-white rounded-md"
                onClick={handleCancelPopup}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue1 text-white rounded-md"
                onClick={handleConfirmDelete}
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

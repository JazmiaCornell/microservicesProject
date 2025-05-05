import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

// Citation Scope: Implementation of React, Redux, and Axios
// Date: 05/04/2025
// Originality: Adapted
// Source: https://www.youtube.com/watch?v=dICDmbgGFdE&list=PLzF6FKB4VN3_8lYlLOsJI8hElGLRgUs7C
// Author: TechCheck

function Donations() {
  // get state from redux
  const username = useSelector((state) => state.auth.user);

  // states for data request
  const [userId, setUserId] = useState(null);
  const [donations, setDonations] = useState([]);

  // states for user and donation data
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingDonations, setLoadingDonations] = useState(false);

  useEffect(() => {
    if (username) {
      // tracks state of request
      setLoadingUser(true);

      // requests user data
      axios
        .get(`http://localhost:8080/get-user/${username}`)
        .then((response) => {
          const data = response.data;
          console.log(data.user_id);

          // setuserId with returned data
          setUserId(data.user_id);
          setLoadingUser(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoadingUser(false);
        });
    }
  }, [username]);

  useEffect(() => {
    if (userId) {
      // tracks state of request
      setLoadingDonations(true);

      // requests donation data
      axios
        .get(`http://localhost:8080/donations?userId=${userId}`)
        .then((response) => {
          const data = response.data;
          console.log("Fetched donations:", data); // Log to verify data
          setDonations(data);
          setLoadingDonations(false);
        })
        .catch((error) => {
          console.error("Error fetching donations data:", error);
          setLoadingDonations(false);
        });
    }
  }, [userId]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-4">Donations</h2>

      {/* Donations Table */}
      {loadingUser ? (
        <p>Loading user data...</p>
      ) : !userId ? (
        <p>User not found.</p>
      ) : loadingDonations ? (
        <p>Loading donations...</p>
      ) : donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Donation ID</th>
              <th className="py-2 px-4 border-b">User ID</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Payment Method</th>
              <th className="py-2 px-4 border-b">Donation Category</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Created Time</th>
              <th className="py-2 px-4 border-b">Updated Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.donation_id}>
                <td className="py-2 px-4 border-b">{donation.donation_id}</td>
                <td className="py-2 px-4 border-b">
                  {donation.donation_user_id}
                </td>
                <td className="py-2 px-4 border-b">${donation.amount}</td>
                <td className="py-2 px-4 border-b">
                  {donation.payment_method}
                </td>
                <td className="py-2 px-4 border-b">
                  {donation.donation_category}
                </td>
                <td className="py-2 px-4 border-b">{donation.status}</td>
                <td className="py-2 px-4 border-b">{donation.created_at}</td>
                <td className="py-2 px-4 border-b">{donation.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Donations;

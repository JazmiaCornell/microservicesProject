import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function Donations() {
  const username = useSelector((state) => state.auth.user);
  const [userId, setUserId] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingDonations, setLoadingDonations] = useState(false);

  useEffect(() => {
    if (username) {
      setLoadingUser(true);

      // Fetch user data
      axios
        .get(`http://localhost:8080/get-user/${username}`)
        .then((response) => {
          const data = response.data;
          console.log(data.user_id); // Log to verify correct user_id
          setUserId(data.user_id);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        })
        .finally(() => setLoadingUser(false));
    }
  }, [username]);

  useEffect(() => {
    if (userId) {
      setLoadingDonations(true);

      // Fetch donations data based on userId
      axios
        .get(`http://localhost:8080/donations?userId=${userId}`)
        .then((response) => {
          const data = response.data;
          console.log("Fetched donations:", data); // Log to verify data
          setDonations(data);
        })
        .catch((error) => {
          console.error("Error fetching donations data:", error);
        })
        .finally(() => setLoadingDonations(false));
    }
  }, [userId]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-4">Donations</h2>

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

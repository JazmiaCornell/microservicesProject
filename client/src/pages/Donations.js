import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

// Citation Scope: Implementation of React, Redux, and Axios
// Date: 05/04/2025
// Originality: Adapted
// Source: https://www.youtube.com/watch?v=dICDmbgGFdE&list=PLzF6FKB4VN3_8lYlLOsJI8hElGLRgUs7C
// Author: TechCheck

function Donations() {
  const user_id = useSelector((state) => state.auth.user_id);

  const [donations, setDonations] = useState([]);
  const [loadingDonations, setLoadingDonations] = useState(false);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoadingDonations(true);
        const response = await axios.get(
          `http://localhost:8081/donations/${user_id}`
        );
        console.log("Fetched donations");
        setDonations(response.data);
      } catch (error) {
        if (error.response) {
          console.error("Server error:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Request setup error:", error.message);
        }
      } finally {
        setLoadingDonations(false);
      }
    };

    if (user_id) {
      fetchDonations();
    }
  }, [user_id]);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h2 className="text-3xl font-semibold mb-6 text-center">Donations</h2>

      {!user_id ? (
        <p className="text-center">User not found.</p>
      ) : loadingDonations ? (
        <p className="text-center">Loading donations...</p>
      ) : donations.length === 0 ? (
        <p className="text-center">No donations found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b border-gray-300 text-center">
                  Donation ID
                </th>
                <th className="py-2 px-4 border-b border-gray-300 text-center">
                  User ID
                </th>
                <th className="py-2 px-4 border-b border-gray-300 text-center">
                  Amount
                </th>
                <th className="py-2 px-4 border-b border-gray-300 text-center">
                  Payment Method
                </th>
                <th className="py-2 px-4 border-b border-gray-300 text-center">
                  Donation Category
                </th>
                <th className="py-2 px-4 border-b border-gray-300 text-center">
                  Status
                </th>
                <th className="py-2 px-4 border-b border-gray-300 text-center">
                  Created Time
                </th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.donation_id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-300 text-center">
                    {donation.donation_id}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 text-center">
                    {donation.donation_user_id}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 text-center">
                    ${donation.amount}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 text-center">
                    {donation.payment_method}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 text-center">
                    {donation.donation_category}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 text-center">
                    {donation.status}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 text-center whitespace-nowrap">
                    {new Date(donation.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Donations;

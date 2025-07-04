import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Citation Scope: Implementation of React, Redux, and Axios
// Date: 05/04/2025
// Originality: Adapted
// Source: https://www.youtube.com/watch?v=dICDmbgGFdE&list=PLzF6FKB4VN3_8lYlLOsJI8hElGLRgUs7C
// Author: TechCheck

const Dashboard = () => {
  // navigates to page
  const navigate = useNavigate();

  // state from Redux
  const username = useSelector((state) => state.auth.username);
  const user_id = useSelector((state) => state.auth.user_id);

  // state for data requests
  const [totalDonations, setTotalDonations] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    if (user_id) {
      console.log("Sending to microservice-D:", {
        user_id,
      });
      const fetchTotalDonations = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8081/dashboard/total-donations/${user_id}`
          );
          setTotalDonations(response.data.total_donations);
        } catch (error) {
          console.error("Error fetching total donations:", error);
        }
      };

      const fetchRecentTransactions = async () => {
        try {
          console.log("Sending to microservice-D:", {
            user_id,
          });
          const response = await axios.get(
            `http://localhost:8081/dashboard/recent-transactions/${user_id}`
          );
          setRecentTransactions(response.data);
        } catch (error) {
          console.error("Error fetching recent transactions:", error);
        }
      };

      fetchTotalDonations();
      fetchRecentTransactions();
    }
  }, [user_id]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {username ? (
        <h4 className="pb-6 text-4xl md:text-6xl text-center text-black font-poppins">
          Hi, {username}
        </h4>
      ) : null}
      <h2 className="text-3xl font-semibold mb-4">Account Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total donation Card */}
        <div className="w-full p-6 bg-white shadow-lg rounded-lg">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2">
              Donations This Year ({new Date().getFullYear()}):
            </h3>

            <p className="font-heading text-7xl text-blue1 text-center mt-10">
              ${totalDonations}
            </p>
            <p className="text-center font-dm mt-5">
              Your total contributions this year
            </p>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="max-w-4xl p-6 bg-white shadow-lg rounded-lg">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2">
              Recent Donations (Last Month):
            </h3>
            {recentTransactions.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <table className="min-w-full table-auto text-center">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Amount</th>
                      <th className="px-4 py-2">Payment Method</th>
                      <th className="px-4 py-2">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions
                      .slice(0, 5)
                      .map((transaction, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">
                            {new Date(
                              transaction.created_at
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="px-4 py-2">${transaction.amount}</td>
                          <td className="px-4 py-2">
                            {transaction.payment_method}
                          </td>
                          <td className="px-4 py-2">
                            {transaction.donation_category}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                {/* Button to View More Transactions */}
                <div className="mt-4 text-center">
                  <button
                    className="px-6 py-2 bg-blue1 text-white rounded-md focus:outline-none"
                    onClick={() => navigate("/donations")}
                  >
                    View More Transactions
                  </button>
                </div>
              </div>
            ) : (
              <p>No recent donations found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

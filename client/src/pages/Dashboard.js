import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const username = useSelector((state) => state.auth.user);

  const [totalDonations, setTotalDonations] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    if (username) {
      const fetchTotalDonations = async () => {
        try {
          const response = await axios.get(
            `/dashboard/total-donations/${username}`
          );
          setTotalDonations(response.data.total_donations);
        } catch (error) {
          console.error("Error fetching total donations:", error);
        }
      };

      const fetchRecentTransactions = async () => {
        try {
          const response = await axios.get(
            `/dashboard/recent-transactions/${username}`
          );
          setRecentTransactions(response.data);
        } catch (error) {
          console.error("Error fetching recent transactions:", error);
        }
      };

      fetchTotalDonations();
      fetchRecentTransactions();
    }
  }, [username]);

  // Handle click event to navigate to donations page
  const handleViewMoreClick = () => {
    navigate("/donations"); // Redirect to the donations page
  };

  return (
    <div className="container mx-auto p-6">
      {username ? (
        <h4 className="pb-6 text-4xl md:text-6xl text-center text-black font-poppins">
          Hi, {username}
        </h4>
      ) : null}
      <h2 className="text-3xl font-semibold mb-4">Account Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total donation Card */}
        <div className="max-w-4xl p-6 bg-white shadow-lg rounded-lg">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2">
              Donations This Year (2025):
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
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                      <th className="px-4 py-2 text-left">Payment Method</th>
                      <th className="px-4 py-2 text-left">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions
                      .slice(0, 5)
                      .map((transaction, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">
                            {transaction.created_at}
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
                    onClick={handleViewMoreClick} // Add onClick handler
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

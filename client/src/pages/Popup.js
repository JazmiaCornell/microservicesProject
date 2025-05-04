import React from "react";

const Popup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="">Welcome to Nazareth!</h1>
        <h2 className="text-xl font-bold mb-4 text-center">NEW FEATURE!</h2>
        <p className="mb-4">
          We’re excited to introduce a new feature that lets you easily view
          your donation history and track your giving — and the best part? It’s
          completely free of charge!
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>Access Past Donations</strong>: View details of all your
            previous contributions.
          </li>
          <li>
            <strong>Track Giving</strong>: Stay on top of your giving goals and
            activity.
          </li>
          <li>
            <strong>Save Time</strong>: All your donation records in one place,
            perfect for tax season and personal budgeting.
          </li>
        </ul>
        <p className="mb-4">Start exploring now from your dashboard!</p>
        <p className="mb-4">
          If you have any questions or need assistance, feel free to reach out
          to us. We're here to help!
        </p>
        <div className="text-center">
          <button
            className="bg-blue1 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;

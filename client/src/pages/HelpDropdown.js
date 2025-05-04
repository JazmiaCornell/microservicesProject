// HelpDropdown.jsx or HelpDropdown.js
import { useState } from "react";

export default function HelpDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-w-xl mx-auto my-4 font-dm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue1 text-white px-4 py-2 rounded-lg shadow hover:bg-blue1 hover:bg-opacity-50 transition"
      >
        Help
      </button>

      {isOpen && (
        <div className="mt-3 bg-gray-100 rounded-lg p-4 shadow-inner">
          <ol className="list-decimal list-inside space-y-2 text-gray-800">
            <li>
              Click the <strong>Edit</strong> button to update your profile
              page.
            </li>
            <li>
              Update your username, password, name, email, or billing address.
            </li>
            <li>
              Click <strong>Save Changes</strong> to update profile.
            </li>
            <li>A popup will appear to confirm changes.</li>
            <li>
              Click <strong>Confirm</strong> to apply your updates.
            </li>
            <li>
              Click <strong>Cancel</strong> to revert changes to your personal
              information.
            </li>
          </ol>
          <p className="mt-3 text-sm text-black">
            Need more help? Contact support.
          </p>
        </div>
      )}
    </div>
  );
}

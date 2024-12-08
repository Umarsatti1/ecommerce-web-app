import { User, ShoppingBag, LogOut, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { useState } from "react";
import { signOut } from "../../features/account/accountSlice";
import { clearCart } from "../../features/cart/cartSlice";

export default function SignedInMenu() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.account);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(signOut());
    dispatch(clearCart());
  };

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300"
      >
        <span>{user?.email}</span>
      </button>

      {dropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <ul className="py-1">
            <li>
              <Link
                to="/profile-settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                <User className="w-4 h-4 mr-2 text-gray-500" />
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                <ShoppingBag className="w-4 h-4 mr-2 text-gray-500" />
                My Orders
              </Link>
            </li>
            {user?.roles?.includes("Admin") && (
              <li>
                <Link
                  to="/all-orders"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  All Orders
                </Link>
              </li>
            )}
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setDropdownOpen(false);
                }}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2 text-gray-500" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

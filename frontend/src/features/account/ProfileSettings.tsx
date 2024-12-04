import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchCurrentUser, setUser } from "../../features/account/accountSlice";
import agent from "../../app/api/api";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  Password?: string;
  newPassword?: string;
}

const ProfileSettings = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.account);

  const [profile, setProfile] = useState<ProfileFormValues>({
    firstName: "",
    lastName: "",
    Password: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        await dispatch(fetchCurrentUser());
      }
      if (user) {
        setProfile({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          Password: "",
          newPassword: "",
        });
      }
      setLoading(false);
    };
    loadUserData();
  }, [dispatch, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      setMessage({ text: "First name and last name cannot be empty.", type: "error" });
      return;
    }

    try {
      await agent.Account.updateProfile(profile);
      setMessage({ text: "Profile updated successfully.", type: "success" });
      setProfile({ ...profile, Password: "", newPassword: "" });
      dispatch(setUser({ ...user, firstName: profile.firstName, lastName: profile.lastName }));
    } catch (error) {
      setMessage({ text: "Error updating profile. Please check your information.", type: "error" });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-7">
        <h1 className="text-3xl font-bold mb-4 text-center">Profile Settings</h1>

        {message && (
          <div
            className={`p-4 mb-4 rounded-md ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">Current Profile Information</h2>
        <div className="mb-6">
          <p>
            <strong>First Name:</strong> {user?.firstName || "N/A"}
          </p>
          <p>
            <strong>Last Name:</strong> {user?.lastName || "N/A"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="Password"
            value={profile.Password}
            onChange={handleChange}
            type="password"
            placeholder="Old Password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="newPassword"
            value={profile.newPassword}
            onChange={handleChange}
            type="password"
            placeholder="New Password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;

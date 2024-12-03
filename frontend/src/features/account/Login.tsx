import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FieldValues } from "react-hook-form";
import { useAppDispatch } from "../../app/store/configureStore";
import { signInUser } from "./accountSlice";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  async function submitForm(data: FieldValues) {
    try {
      await dispatch(signInUser(data));
      navigate(location.state?.from || "/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Sign in to access your account.
        </p>

        <form
          onSubmit={handleSubmit(submitForm)}
          noValidate
          className="space-y-6"
        >
          <div className="space-y-4">
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
                  message: "Not a valid email address",
                },
              })}
              type="email"
              placeholder="Email"
              className={`w-full border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">
                {errors.email.message as string}
              </p>
            )}

            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              placeholder="Password"
              className={`w-full border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.password && (
              <p className="text-sm text-red-500">
                {errors.password.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-md bg-black text-white text-lg font-medium hover:bg-gray-800"
          >
            Sign In
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        {/* Google Sign-In */}
        <button
          className="w-full flex items-center justify-center gap-2 bg-gray-200 text-black py-2.5 px-4 rounded-md mt-4 hover:bg-gray-300"
          onClick={() => toast.info("Google Sign-In not yet implemented")}
        >
          <FcGoogle className="h-5 w-5" />
          Sign in with Google
        </button>

        <p className="mt-4 text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

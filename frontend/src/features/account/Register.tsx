import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import api from "../../app/api/api";
import { FcGoogle } from "react-icons/fc";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  function handleApiErrors(errors: any) {
    if (errors) {
      errors.forEach((error: string) => {
        if (error.includes("Password")) {
          setError("password", { message: error });
        } else if (error.includes("Email")) {
          setError("email", { message: error });
        } else if (error.includes("Username")) {
          setError("username", { message: error });
        } else if (error.includes("First Name")) {
          setError("firstName", { message: error });
        } else if (error.includes("Last Name")) {
          setError("lastName", { message: error });
        }
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2 pb-6">Create an Account</h1>

        <form
          onSubmit={handleSubmit((data) =>
            api.Account.register(data)
              .then(() => {
                toast.success("Registration successful! You can now login");
                navigate("/login");
              })
              .catch((error) => handleApiErrors(error))
          )}
          noValidate
        >
          <div className="space-y-4">
            <input
              {...register("firstName", { required: "First name is required" })}
              type="text"
              placeholder="First Name"
              className={`w-full border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">
                {errors.firstName.message as string}
              </p>
            )}

            <input
              {...register("lastName", { required: "Last name is required" })}
              type="text"
              placeholder="Last Name"
              className={`w-full border ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">
                {errors.lastName.message as string}
              </p>
            )}

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
              {...register("username", { required: "Username is required" })}
              type="text"
              placeholder="Username"
              className={`w-full border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.username && (
              <p className="text-sm text-red-500">
                {errors.username.message as string}
              </p>
            )}

            <input
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value:
                    /(?=^.{6,15}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>&lt;,])(?!.*\s).*$/,
                  message:
                    "Password must be 6-15 characters with uppercase, lowercase, number, and special character",
                },
              })}
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
            className="w-full mt-6 py-2.5 rounded-md bg-black text-white text-lg font-medium hover:bg-gray-800"
          >
            Sign up
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

        {/* Google Sign-Up */}
        <button
          className="w-full flex items-center justify-center gap-2 bg-gray-200 text-black py-2.5 px-4 rounded-md mt-4 hover:bg-gray-300"
          onClick={() => toast.info("Google Sign-Up not yet implemented")}
        >
          <FcGoogle className="h-5 w-5" />
          Sign up with Google
        </button>

        <p className="mt-4 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

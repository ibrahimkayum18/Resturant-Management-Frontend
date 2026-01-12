import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../../Routes/AuthProvider";
import toast from "react-hot-toast";
import axios from "axios";

const LogIn = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = (e) => {
  e.preventDefault();

  const { email, password } = formData;
  console.log(formData)

  login(email, password)
    .then(async (result) => {
      // 🔹 Call backend to update last login activity
      await axios.post("http://localhost:5000/users", {
        email,
        name: result.user?.displayName || "Customer",
      });

      toast.success("Logged In Successfully");
      navigate(location?.state ? location.state : "/");
    })
    .catch((error) => {
      console.error(error);
      toast.error(error.message);
    });
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="rounded" />
              Remember me
            </label>
            <span className="text-blue-600 hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">
            <Link to="/register">
                register
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default LogIn;

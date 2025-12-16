// frontend/src/components/Login.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../../config/firebase";

import { GlassCard } from "../common/Apptheme";

const Login = () => {
  const location = useLocation();
  const passedname = location.state?.name || "";

  const navigate = useNavigate();

  const [name, setName] = useState(passedname);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/home");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlelogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, pass)
      .then(() => {
        navigate("/home");
        console.log("User Logged in!");
      })
      .catch((err) => {
        setErr("Passwords mismatch..");
        console.log("Error Logging in..", err);
      });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 mt-[2%]">
      <GlassCard className="max-w-md w-full bg-white shadow-xl rounded-2xl border border-gray-200">
        <form onSubmit={handlelogin} className="space-y-6 text-gray-700">
          <h2 className="text-2xl font-semibold text-[#2874F0]">
            Hey {name || "there"} 👋
          </h2>
          <p className="text-sm text-gray-500">
            Login to your account
          </p>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter your name"
              required
              className="w-full rounded-lg p-3 border border-gray-300 outline-none focus:ring-2 focus:ring-[#2874F0]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              required
              className="w-full rounded-lg p-3 border border-gray-300 outline-none focus:ring-2 focus:ring-[#2874F0]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              type="password"
              placeholder="Enter your password"
              required
              className="w-full rounded-lg p-3 border border-gray-300 outline-none focus:ring-2 focus:ring-[#2874F0]"
            />
          </div>

          {err && (
            <p className="text-red-500 text-sm font-medium">
              {err}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#2874F0] hover:bg-[#1f5fd6] text-white py-3 rounded-lg font-semibold transition"
          >
            Login
          </button>

          <p className="text-sm text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-[#2874F0] font-semibold hover:underline"
            >
              Register here
            </Link>
          </p>
        </form>
      </GlassCard>
    </div>
  );
};

export default Login;

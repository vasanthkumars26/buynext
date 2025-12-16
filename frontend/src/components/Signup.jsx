// frontend/src/components/Signup.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import auth from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Theme imports
import AppTheme, { GlassCard, CTAButton, AccentText } from "../common/Apptheme";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");
  const navigate = useNavigate();

  const [err, setErr] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/home");
      }
    });
  }, [navigate]);

  const handleuser = (e) => {
    e.preventDefault();
    if (pass != cpass) {
      setErr("Passwords mismatch..");
      return;
    }
    createUserWithEmailAndPassword(auth, email, pass)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log("Error");
        setErr(error.message);
      });

    console.log("User Registered!!", { name, email });
    navigate("/", { state: { name } });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 mt-[3%] bg-gray-50">
      <GlassCard className="max-w-md w-full bg-white shadow-lg border border-gray-200">
        <form onSubmit={handleuser} className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 text-center">
            SignUp
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name:</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name.."
              required
              className="w-full rounded-2xl p-3 outline-none border border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email.."
              required
              className="w-full rounded-2xl p-3 outline-none border border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password:</label>
            <input
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              type="text"
              placeholder="Password.."
              required
              className="w-full rounded-2xl p-3 outline-none border border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password:</label>
            <input
              value={cpass}
              onChange={(e) => setCpass(e.target.value)}
              type="text"
              placeholder="Confirm password.."
              required
              className="w-full rounded-2xl p-3 outline-none border border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {err && <p className="text-red-500 mt-1 animate-pulse">{err}</p>}

          <div className="flex items-center justify-center gap-4">
            <button
              className="w-36 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-full transition"
              type="submit"
            >
              Signup
            </button>
          </div>

          <p className="text-sm text-gray-600 text-center">
            Already account exists?
            <Link to="/" className="font-semibold text-blue-600 underline ml-2">
              Login here!
            </Link>
          </p>
        </form>
      </GlassCard>
    </div>
  );
};

export default Signup;

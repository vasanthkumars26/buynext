// frontend/src/components/Signup.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import auth from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Theme imports — adjust if your file is named AppTheme.jsx instead of Apptheme.jsx
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // If your app is already wrapped in <AppTheme> globally, you can remove this wrapper.
    
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
        <GlassCard className="max-w-md w-full">
          <form onSubmit={handleuser} className="space-y-6 text-gray-300">
            <h2 className="text-2xl md:text-3xl font-semibold">
            SignUp
            </h2>

            <div>
              <label className="text-start ml-2 block text-sm font-medium text-white/80 mb-2">Name:</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Name.."
                required
                className="w-full rounded-2xl p-3 outline-none glass border border-white/8 placeholder-white/60 text-white bg-transparent"
              />
            </div>

            <div>
              <label className="text-start ml-2 block text-sm font-medium text-white/80 mb-2">Email:</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="Email.."
                required
                className="w-full rounded-2xl p-3 outline-none glass border border-white/8 placeholder-white/60 text-white bg-transparent"
              />
            </div>

            <div>
              <label className="text-start ml-2 block text-sm font-medium text-white/80 mb-2">Password:</label>
              <input
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                type="text"              /* kept as text to preserve original behavior */
                placeholder="Password.."
                required
                className="w-full rounded-2xl p-3 outline-none glass border border-white/8 placeholder-white/60 text-white bg-transparent"
              />
            </div>

            <div>
              <label className="text-start ml-2 block text-sm font-medium text-white/80 mb-2">Confirm password:</label>
              <input
                value={cpass}
                onChange={(e) => setCpass(e.target.value)}
                type="text"              /* kept as text to preserve original behavior */
                placeholder="Confirm password.."
                required
                className="w-full rounded-2xl p-3 outline-none glass border border-white/8 placeholder-white/60 text-white bg-transparent"
              />
            </div>

            {err && <p className="text-red-400 mt-1 animate-pulse">{err}</p>}

            <div className="flex items-center justify-center gap-4">
              <button className="w-36 bg-red-700 text-sm text-gray-300 px-3 py-1 rounded-full" type="submit">Signup</button>
            </div>

            <p className="text-sm text-white/80">
              Already account exists?
              <Link to="/" className="font-semibold text-red-600 underline ml-2">
                Login here!
              </Link>
            </p>
          </form>
        </GlassCard>
      </div>
    
  );
};

export default Signup;

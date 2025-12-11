// frontend/src/components/Login.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../../config/firebase";

// IMPORTANT: adjust path if your theme file name differs (Apptheme vs AppTheme)
import AppTheme, { GlassCard, CTAButton, AccentText } from "../common/Apptheme";

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

    // keep exactly the same auth logic you had
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
      .then((res) => {
        navigate("/home");
        console.log("User Logged in!");
      })
      .catch((err) => {
        setErr("Passwords mismatch..");
        console.log("Error Logging in..", err);
      });
  };

  return (
    // If you already wrap your app with <AppTheme> globally, you can remove the outer AppTheme wrapper
   
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
        <GlassCard className="max-w-md w-full">
          <form onSubmit={handlelogin} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Hey <AccentText>{name || "there"}</AccentText>!{" "}
              <span className="text-white/80">You can login here👇🏼</span>
            </h2>

            <div>
              <label className="text-start ml-2 block text-sm font-medium text-white/80 mb-2">
                Name
              </label>
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
              <label className="text-start ml-2 block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email.."
                required
                className="w-full rounded-2xl p-3 outline-none glass border border-white/8 placeholder-white/60 text-white bg-transparent"
              />
            </div>

            <div>
              <label className="text-start ml-2 block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <input
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                type="password"
                placeholder="Password.."
                required
                className="w-full rounded-2xl p-3 outline-none glass border border-white/8 placeholder-white/60 text-white bg-transparent"
              />
            </div>

            {err && <p className="text-red-400 mt-1 animate-pulse">{err}</p>}

            <div className="flex items-center justify-between gap-4">
              <CTAButton type="submit">Login</CTAButton>

            </div>
              <Link
                to="/signup"
                className="text-sm text-white/80 hover:text-white  ml-auto"
              >
                Don't have an account?{" "}
                <span className="text-cyan-300 underline font-semibold">Register here!</span>
              </Link>
          </form>
        </GlassCard>
      </div>
    
  );
};

export default Login;

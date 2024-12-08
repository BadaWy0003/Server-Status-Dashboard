"use client";
import './login.css';
import { useState } from "react";
import { logIn, signInWithGoogle } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import GoogleButton from "react-google-button";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("Logged in user:", user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      await logIn(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err);
    }
  };




  return (
    <div className="login-container">
      <form onSubmit={handleLogIn} className="login-form">
        <h2 className="form-title">Log In</h2>
        {error && <p className="form-error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="form-button">
          Log In
        </button>
        <p>Don't have an account?<a className='signup-link' href='/signup'>Create an account</a></p>
        <p>Or</p>
        
        <div className="google-login-container">
          <GoogleButton
            onClick={handleGoogleLogin}
            style={{ width: "100%", backgroundColor: "#0d92a3" }}
          />
        </div>
      </form>
    </div>
  );
}

"use client";
import './login.css';
import { useState } from "react";
import { logIn, signInWithGoogle } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import GoogleButton from "react-google-button";

export default function LogIn() {
  // State for storing input values and errors
  const [email, setEmail] = useState(""); // Email input value
  const [password, setPassword] = useState(""); // Password input value
  const [error, setError] = useState(null); // Error state for login failure
  const router = useRouter(); // Router for navigation after login

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle(); // Use Google authentication
      console.log("Logged in user:", user);
      router.push("/dashboard"); // Redirect to the dashboard after successful login
    } catch (error) {
      setError("Google login failed. Please try again."); // Handle Google login failure
      console.error("Login failed:", error);
    }
  };

  // Handle regular email/password login
  const handleLogIn = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submit
    try {
      await logIn(email, password); // Log in with email and password
      router.push("/dashboard"); // Redirect to the dashboard after successful login
    } catch (err) {
      setError("Invalid email or password. Please try again."); // Show error for invalid login
    }
  };

  return (
    <div className="login-container">
      {/* Login Form */}
      <form onSubmit={handleLogIn} className="login-form">
        <h2 className="form-title">Log In</h2>

        {/* Display error message if login fails */}
        {error && <p className="form-error">{error}</p>}

        {/* Email input field */}
        <input
          type="email"
          placeholder="Email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state on change
        />

        {/* Password input field */}
        <input
          type="password"
          placeholder="Password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state on change
        />

        {/* Submit button */}
        <button type="submit" className="form-button">
          Log In
        </button>

        {/* Link to sign-up page */}
        <p>
          Don't have an account? 
          <a className='signup-link' href='/signup'>Create an account</a>
        </p>

        <hr />
        <p>Or</p>

        {/* Google Login button */}
        <div className="google-login-container">
          <GoogleButton
            onClick={handleGoogleLogin}
            style={{ width: "100%", backgroundColor: "#0d92a3" }} // Custom Google button style
          />
        </div>
      </form>
    </div>
  );
}

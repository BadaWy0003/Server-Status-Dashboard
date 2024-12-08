"use client";

import './signup.css';
import { useState } from "react";
import { signUp } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function SignUp() {
  // State for email, password, and error handling
  const [email, setEmail] = useState(""); // Stores email input
  const [password, setPassword] = useState(""); // Stores password input
  const [error, setError] = useState(null); // Stores any error message during sign-up
  const router = useRouter(); // Router for navigation after successful sign-up

  // Handle the sign-up process
  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    try {
      await signUp(email, password); // Call the signUp function from firebase
      router.push("/dashboard"); // Redirect to dashboard after successful sign-up
    } catch (err) {
      setError(err.message); // Set error message if sign-up fails
    }
  };

  return (
    <div className="signup-container">
      {/* Sign Up Form */}
      <form onSubmit={handleSignUp} className="signup-form">
        <h2 className="form-title">Sign Up</h2>

        {/* Display error message if sign-up fails */}
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

        {/* Submit button for sign-up */}
        <button type="submit" className="form-button">
          Sign Up
        </button>

        {/* Link to login page for users who already have an account */}
        <p>Already have an account? <a className='login-link' href='/login'>Login</a></p>
      </form>
    </div>
  );
}

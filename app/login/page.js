"use client";
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
    //   alert("Log-in successful!");
        router.push("/dashboard");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogIn} className="p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Log In</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Log In
        </button>
        <GoogleButton
            onClick={handleGoogleLogin}
            style={{ width: "100%" }}
            />;

        
      </form>
    </div>
  );
}
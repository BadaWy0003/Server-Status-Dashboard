"use client";
import './home.css'
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/login"); // Navigate to the login page
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to Our Dashboard</h1>
        <p className="home-description">
          Welcome to the best platform for managing your servers. Here, you can monitor performance, uptime, and more. Let's get started!
        </p>
        <button onClick={handleGetStarted} className="home-button">
          Get Started
        </button>
      </div>
    </div>
  );
}

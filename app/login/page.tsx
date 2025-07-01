"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from './login.module.css'; // Import the styles
import newui from '../newui/newui.module.css'; // Import newui styles for logo/brand
import { getRedirectUrl, clearRedirectUrl } from '../utils/apiUtils';
import { motion } from "framer-motion";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if user is already logged in and redirect them
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const redirectUrl = getRedirectUrl();
      if (redirectUrl) {
        clearRedirectUrl();
        router.push(redirectUrl);
      } else {
        router.push('/');
      }
    }
  }, [router]);

  const handleLogin = async () => {
    // Validation for empty fields
    if (!username || !password) {
      setError("Please fill out both username and password.");
      return;
    }

    setError(null); // Reset previous errors
    setLoading(true); // Set loading state

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/token/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || "Invalid credentials.");
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Store token and username in localStorage
      localStorage.setItem("token", data.access);
      localStorage.setItem("username", username);

      // Associate anonymous orders if present
      const anonOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      const orderIds = anonOrders.map((order: any) => ({ id: (order.order && order.order.id) || order.id }));
      if (orderIds.length > 0) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/associate_orders/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.access}`,
            },
            body: JSON.stringify({ orders: orderIds }),
          });
          localStorage.removeItem('orderHistory');
        } catch (e) {
          // Optionally handle error
        }
      }

      console.log("Login successful:", data);

      // Check for redirect URL and navigate accordingly
      const redirectUrl = getRedirectUrl();
      if (redirectUrl) {
        clearRedirectUrl();
        router.push(redirectUrl);
      } else {
        // Default redirect to the profile page
        router.push("/");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  return (
    <div className={styles.container}>
      {/* Floating SVG shapes for background with animation */}
      <motion.svg className={styles.bgShape1} width="340" height="340" viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1 }}>
        <ellipse cx="170" cy="170" rx="170" ry="170" fill="#38cbbb" fillOpacity="0.18"/>
      </motion.svg>
      <motion.svg className={styles.bgShape2} width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
        <ellipse cx="110" cy="110" rx="110" ry="110" fill="#6b7f93" fillOpacity="0.13"/>
      </motion.svg>
      <motion.svg className={styles.bgShape3} width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
        <ellipse cx="90" cy="90" rx="90" ry="90" fill="#38cbbb" fillOpacity="0.10"/>
      </motion.svg>
      <motion.div className={styles.formWrapper}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {/* Logo/Brand */}
        <a href="/" className={`${newui.logo} ${styles.logoLink}`}>
          <span className={newui.logoText}>Art</span>
          <span className={newui.logoHighlight}>Case</span>
        </a>
        <div className={styles.tagline}>
          Welcome back! Sign in to your ArtCase account.
        </div>
        <h2 className={styles.heading}>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.inputWrapper}>
          <i className="fas fa-user" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyPress}
            className={styles.input}
          />
        </div>
        <div className={styles.inputWrapper}>
          <i className="fas fa-lock" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            className={styles.input}
          />
        </div>
        <button
          className={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {/* Divider */}
        <div className={styles.divider}>
          <div className={styles.dividerLine}></div>
          <span className={styles.dividerText}>or</span>
          <div className={styles.dividerLine}></div>
        </div>
        <button
          className={styles.guestButton}
          onClick={() => router.push('/')}
        >
          Continue as Guest
        </button>
        <div className={styles.registerLink}>
          <span>Don't have an account? </span>
          <a href="/register">Register</a>
        </div>
        <a href="/" className={styles.backToHome}>
          <i className="fas fa-arrow-left" style={{ marginRight: 6 }}></i>
          Back to Home
        </a>
      </motion.div>
    </div>
  );
}

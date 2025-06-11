"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from './login.module.css'; // Import the styles

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

      console.log("Login successful:", data);

      // Redirect to the profile page
      router.push("/fyp");
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
      <div className={styles.formWrapper}>
        <h2 className={styles.heading}>Login</h2>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.inputWrapper}>
          <i className="fas fa-user"></i>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyPress} // Add key press handler
            className={styles.input}
          />
        </div>

        <div className={styles.inputWrapper}>
          <i className="fas fa-lock"></i>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress} // Add key press handler
            className={styles.input}
          />
        </div>

        <button
          className={styles.button}
          onClick={handleLogin}
          disabled={loading} // Disable button when loading
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className={styles.registerLink}>
          <span>Don't have an account? </span>
          <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
}

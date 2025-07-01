'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js
import styles from './register.module.css'; // Import the styles
import newui from '../newui/newui.module.css'; // Import newui styles for logo/brand
import { getRedirectUrl, clearRedirectUrl } from '../utils/apiUtils';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState("istockphoto-1223671392-612x612.jpg");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize the router

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

  const send = async () => {
    setLoading(true);
    setError(null); // Reset previous errors
    let profilePicUrlToSend = profilePic ? profilePicUrl : "https://res.cloudinary.com/daalfrqob/image/upload/v1730076406/default-avatar-profile-trendy-style-social-media-user-icon-187599373_jtpxbk.webp"; // Use default if no profile pic uploaded

    if (!username || !password || !first_name || !last_name || !email) {
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    if (profilePic) {
      const formData = new FormData();
      formData.append("file", profilePic);
      formData.append("upload_preset", "ml_default");

      try {
        const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/daalfrqob/image/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          setError("Error uploading profile image.");
          setLoading(false);
          return;
        }

        const uploadData = await uploadResponse.json();
        profilePicUrlToSend = uploadData.secure_url; // Set the URL after upload
      } catch (error) {
        setError("Error uploading profile image.");
        setLoading(false);
        return;
      }
    }

    const registrationData = {
      username,
      password,
      first_name,
      last_name,
      email,
      profile_pic: profilePicUrlToSend, // Send the profile pic URL
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData && typeof errorData === 'object') {
          if (errorData.username) setError("Username: " + errorData.username);
          else if (errorData.email) setError("Email: " + errorData.email);
          else if (errorData.password) setError("Password: " + errorData.password);
          else setError(errorData.detail || "Registration failed. Please check your details.");
        } else {
          setError("Registration failed. Please check your details.");
        }
        setLoading(false);
        return;
      }

      setError(null); // Clear error on success
      const data = await res.json();
      console.log("Registration successful:", data);

      // After registration, log the user in by calling the login endpoint
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/token/`, {
        method: "POST",
        body: formData,
      });

      if (!loginResponse.ok) {
        const errorText = (await loginResponse.text()) || "Invalid credentials.";
        console.error("Login failed:", errorText);
        return;
      }

      const loginData = await loginResponse.json();
      // Store token and username in localStorage
      localStorage.setItem("token", loginData.access);
      localStorage.setItem("username", username);

      // Check for redirect URL and navigate accordingly
      const redirectUrl = getRedirectUrl();
      if (redirectUrl) {
        clearRedirectUrl();
        router.push(redirectUrl);
      } else {
        // Default redirect to the '/fyp' page after login
        router.push("/");
      }

      setLoading(false);
    } catch (err) {
      setError("Registration error. Please try again.");
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
    setProfilePic(file);
      const imageUrl = URL.createObjectURL(file);
      setProfilePicUrl(imageUrl);
    } else {
      setProfilePic(null);
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
          Join ArtCase and start creating your own style!
        </div>
        <h2 className={styles.heading}>Create Account</h2>
        <div className={styles.formContainer}>
          {error && <div className={styles.error}>{error}</div>}
          {/* Profile Image Section */}
          <div className={styles.profileImageWrapper}>
            <label htmlFor="profilePic" className={styles.profileImageLabel}>
              <img
                src={profilePicUrl || "/default-profile.jpg"}
                alt="Profile"
                className={styles.profileImage}
              />
            </label>
            <input
              id="profilePic"
              type="file"
              className={styles.fileInput}
              onChange={handleFileChange}
            />
            <p className={styles.profileImageText}>Select a Profile Image</p>
          </div>
          {/* Form Fields */}
          <div className={styles.inputWrapper}>
            <i className="fas fa-user" />
            <input
              type="text"
              placeholder="Username"
              className={styles.input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUsername(e.target.value); setError(null); }}
            />
          </div>
          <div className={styles.inputWrapper}>
            <i className="fas fa-lock" />
            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); setError(null); }}
            />
          </div>
          <div className={styles.inputWrapper}>
            <i className="fas fa-id-badge" />
            <input
              type="text"
              placeholder="First Name"
              className={styles.input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setFirstName(e.target.value); setError(null); }}
            />
          </div>
          <div className={styles.inputWrapper}>
            <i className="fas fa-id-badge" />
            <input
              type="text"
              placeholder="Last Name"
              className={styles.input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setLastName(e.target.value); setError(null); }}
            />
          </div>
          <div className={styles.inputWrapper}>
            <i className="fas fa-envelope" />
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); setError(null); }}
            />
          </div>
        </div>
        <button
          className={styles.button}
          onClick={send}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
          <div className={styles.alreadyAccount}>
            <span>Already have an account? </span>
            <a href="/login">Login</a>
          </div>
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
        <a href="/" className={styles.backToHome}>
          <i className="fas fa-arrow-left" style={{ marginRight: 6 }}></i>
          Back to Home
        </a>
      </motion.div>
    </div>
  );
}

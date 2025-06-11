'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js
import styles from './register.module.css'; // Import the styles

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("istockphoto-1223671392-612x612.jpg");
  const router = useRouter(); // Initialize the router

  const send = async () => {
    let profilePicUrlToSend = profilePic ? profilePicUrl : "https://res.cloudinary.com/daalfrqob/image/upload/v1730076406/default-avatar-profile-trendy-style-social-media-user-icon-187599373_jtpxbk.webp"; // Use default if no profile pic uploaded

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
          console.error("Error uploading image:", errorData);
          return;
        }

        const uploadData = await uploadResponse.json();
        profilePicUrlToSend = uploadData.secure_url; // Set the URL after upload
      } catch (error) {
        console.error("Error uploading image:", error);
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
        console.error("Registration failed:", errorData);
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Registration successful:", data);

      // After registration, log the user in by calling the login endpoint
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const loginResponse = await fetch("http://127.0.0.1:8000/api/token/", {
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

      // Redirect to the '/fyp' page after login
      router.push("/fyp");

    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePicUrl(imageUrl);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.heading}>Create Account</h2>
        <div className={styles.formContainer}>
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
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Username"
              className={styles.input}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles.inputWrapper}>
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={styles.inputWrapper}>
            <i className="fas fa-id-badge"></i>
            <input
              type="text"
              placeholder="First Name"
              className={styles.input}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className={styles.inputWrapper}>
            <i className="fas fa-id-badge"></i>
            <input
              type="text"
              placeholder="Last Name"
              className={styles.input}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className={styles.inputWrapper}>
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Register Button */}
          <button className={styles.button} onClick={send}>Register</button>

          {/* Already have an account? */}
          <div className={styles.alreadyAccount}>
            <span>Already have an account? </span>
            <a href="/login">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}

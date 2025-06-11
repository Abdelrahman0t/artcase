// pages/leaderboard.js
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link'
const decodeJwt = (token: string) => {
    const base64Url = token.split(".")[1];  // Get the payload part of the JWT (middle part)
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");  // Fix the URL-safe base64 encoding
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) =>
          "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        )
        .join("")
    );

    return JSON.parse(jsonPayload);  // Parse and return the decoded payload
  };
// Fetch leaderboard data from the backend
async function fetchLeaderboardData() {
  try {
    const [likesResponse, postsResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/top-users-by-likes/`),
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/top-users-by-posts/`),
    ]);

    if (!likesResponse.ok || !postsResponse.ok) {
      throw new Error('Failed to fetch leaderboard data');
    }

    const likesData = await likesResponse.json();
    const postsData = await postsResponse.json();

    return { likesData, postsData };
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return { likesData: [], postsData: [] };
  }
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState({
    likesData: [],
    postsData: [],
  });

  const [loggedInUsername, setLoggedInUsername] = useState(null);


    useEffect(() => {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
  
      console.log("Token in localStorage:", token); // Log to see if token exists in localStorage
  
      if (token) {
        try {
          const decodedToken = decodeJwt(token); // Decode the JWT manually
          console.log("Decoded Token:", decodedToken); // Log the decoded token structure
  
          // Set the loggedInUsername to the `user_id` from the token
          setLoggedInUsername(decodedToken.user_id); // You can use .toString() to make sure it's a string
        } catch (error) {
          console.error("Error decoding token", error); // Log any decoding errors
        }
      } else {
        console.log("No token found in localStorage"); // Log if no token is found
      }
    }, []); // Runs once when the component mounts

  useEffect(() => {
    async function loadData() {
      const data = await fetchLeaderboardData();
      setLeaderboardData(data);
      console.log(data)
    }

    loadData();
  }, []);

  const { likesData, postsData } = leaderboardData;

  return (
    <div>
      <h1>Leaderboard</h1>

      <div>
        <h2>Top Users by Likes</h2>
        <ul>
          {likesData.map((user) => (
            <li key={user.user_id}>
              {user.username}: {user.total_likes} likes
              <Link href={loggedInUsername === user.user_id ? 'profile/' : `other_profile/${user.user_id}`}> get there</Link>
              
            </li>
          ))}
          
        </ul>
      </div>

      <div>
        <h2>Top Users by Posts</h2>
        <ul>
          {postsData.map((user) => (
            <li key={user.user_id}>
              {user.username}: {user.total_posts} posts
              <Link href={loggedInUsername === user.user_id ? 'profile/' : `other_profile/${user.user_id}`}> get there</Link>

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

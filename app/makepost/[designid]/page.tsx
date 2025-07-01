'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';  // Import the useRouter hook
import Image from 'next/image';
import Link from 'next/link';
import styles3 from './makepost.module.css'
import styles1 from '../../fyp/fyp.module.css'
import HashtagPicker from './HashtagPicker';

import Layout from '../../newui/layout';

// Manual JWT decoding function
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

interface DesignProps {
  params: {
    designid: string;
  };
}

const DesignPage = ({ params }: DesignProps) => {
  const [design, setDesign] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);  // Store the username
  const router = useRouter();  // Initialize the router for navigation
  const [error, setError] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>(""); // For post creation
  const [description, setDescription] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  // Get the dynamic design ID from the URL parameter
  const { designid } = params;

  // Retrieve the token from localStorage or your global state
  const token = localStorage.getItem('token');  // Assuming token is stored in localStorage

  useEffect(() => {
    // Decode the token to get the user ID using the manual decodeJwt function
    let decodedUserId: string | null = null;
    if (token) {
      const decoded: any = decodeJwt(token);  // Decode the token manually
      decodedUserId = decoded.user_id;  // Assuming the token has 'user_id' as the identifier
      console.log('Decoded User ID:', decodedUserId);  // Log the decoded user ID

      // Fetch the username from the backend using the decoded user ID
      const fetchUsername = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${decodedUserId}/`, {
            headers: {
              'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
            }
          });
          if (response.ok) {
            const data = await response.json();
            setUsername(data.username);  // Assuming the API returns a 'username' field
            console.log('Fetched Username:', data.username);
          } else {
            console.error('Failed to fetch username');
          }
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      };

      fetchUsername();  // Fetch the username after decoding the token
    }

    // Fetch design data from your backend or API based on the designid
    const fetchDesignData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/design/${designid}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
          }
        });
        if (response.ok) {
          const data = await response.json();
          setDesign(data);
          console.log('Fetched Design:', data);  // Log the fetched design data
        } else {
          console.error('Failed to fetch design data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesignData();
  }, [designid, token]);  // Run the effect when designid or token changes

  // Use another effect to check after the design has been set
  useEffect(() => {
    if (design && username) {
      // If the decoded username doesn't match the design creator's username, redirect
      if (username !== design.user) {
        console.log('Redirecting to FYP page...');
        router.push('/');  // Redirect to FYP page
      }
    }
  }, [design, username, token, router]);  // Run the effect when the design or username is updated

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
        setError("User is not authenticated.");
        return;
    }

    if (!design || !design.id) {
        setError("Design data is missing.");
        return;
    }

    const postData = {
        design: design.id,
        caption,
        description,
        hashtags,
    };

    console.log("Submitting post with data:", postData);
    console.log("Design object:", design);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(postData),
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Post creation failed:", errorData);
            throw new Error(`Failed to create post: ${errorData.error || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log("Post created successfully:", data);
        alert("Post created successfully!");
        router.push('/');  // Redirect to FYP page

    } catch (err) {
        console.error("Error creating post:", err);
        setError(err instanceof Error ? err.message : "Failed to create post.");
    }
};

  // Hashtag suggestions based on design type and class
  const getHashtagSuggestions = () => {
    const HASHTAG_OPTIONS = [
      { label: "Anime", value: "Anime & Manga" },
      { label: "TV/Movies", value: "TV Shows & Movies" },
      { label: "Games", value: "Video Games" },
      { label: "Cartoons", value: "Cartoons & Animated Characters" },
      { label: "Pop", value: "Pop Culture & Music" },
      { label: "K-Pop", value: "K-Pop & Idol Groups" },
      { label: "Celebs", value: "Celebrities & Influencers" },
      { label: "Floral", value: "Floral & Botanical" },
      { label: "Scenery", value: "Scenery & Landscapes" },
      { label: "Abstract", value: "Abstract & Minimalist" },
      { label: "Cats/Dogs", value: "Cats & Dogs" },
      { label: "Wildlife", value: "Wildlife & Exotic Animals" },
      { label: "Fantasy", value: "Fantasy Creatures" },
      { label: "Sports", value: "Football & Basketball" },
      { label: "X-Sports", value: "Extreme Sports" },
      { label: "Fitness", value: "Fitness & Gym" },
      { label: "Inspo", value: "Motivational & Inspirational" },
      { label: "Funny", value: "Funny & Meme-Based" },
      { label: "Gothic", value: "Dark & Gothic" },
      { label: "Sci-Fi", value: "Cyberpunk & Sci-Fi" },
      { label: "Vaporwave", value: "Glitch & Vaporwave" },
      { label: "AI", value: "AI & Robotics" },
      { label: "Flags", value: "Flags & National Pride" },
      { label: "Trad Art", value: "Traditional Art" },
      { label: "Zodiac", value: "Astrology & Zodiac Signs" },
    ];
    
    // Add design-specific suggestions if available
    let suggestions = [...HASHTAG_OPTIONS];
    
    if (design?.theclass) {
      // Check if theclass matches any existing option
      const existingOption = HASHTAG_OPTIONS.find(option => option.value === design.theclass);
      if (existingOption) {
        // If it matches, don't add it again (it's already in the list)
      } else {
        // If it doesn't match, add it as a custom option
        suggestions.unshift({ label: design.theclass, value: design.theclass });
      }
    }
    if (design?.type) {
      const typeWords = design.type.split(' ');
      typeWords.forEach((word: string) => {
        suggestions.unshift({ label: word, value: word });
      });
    }
    
    // Remove duplicates based on value
    const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
      index === self.findIndex(s => s.value === suggestion.value)
    );
    
    return uniqueSuggestions;
  };

  // Get default tag with proper label/value structure
  const getDefaultTag = () => {
    const HASHTAG_OPTIONS = [
      { label: "Anime", value: "Anime & Manga" },
      { label: "TV/Movies", value: "TV Shows & Movies" },
      { label: "Games", value: "Video Games" },
      { label: "Cartoons", value: "Cartoons & Animated Characters" },
      { label: "Pop", value: "Pop Culture & Music" },
      { label: "K-Pop", value: "K-Pop & Idol Groups" },
      { label: "Celebs", value: "Celebrities & Influencers" },
      { label: "Floral", value: "Floral & Botanical" },
      { label: "Scenery", value: "Scenery & Landscapes" },
      { label: "Abstract", value: "Abstract & Minimalist" },
      { label: "Cats/Dogs", value: "Cats & Dogs" },
      { label: "Wildlife", value: "Wildlife & Exotic Animals" },
      { label: "Fantasy", value: "Fantasy Creatures" },
      { label: "Sports", value: "Football & Basketball" },
      { label: "X-Sports", value: "Extreme Sports" },
      { label: "Fitness", value: "Fitness & Gym" },
      { label: "Motivational", value: "Motivational & Inspirational" },
      { label: "Funny", value: "Funny & Meme-Based" },
      { label: "Gothic", value: "Dark & Gothic" },
      { label: "Sci-Fi", value: "Cyberpunk & Sci-Fi" },
      { label: "Vaporwave", value: "Glitch & Vaporwave" },
      { label: "AI", value: "AI & Robotics" },
      { label: "Flags", value: "Flags & National Pride" },
      { label: "Trad Art", value: "Traditional Art" },
      { label: "Zodiac", value: "Astrology & Zodiac Signs" },
    ];

    const defaultValue = design?.theclass || 'design';
    
    // Check if the default value matches any predefined option
    const matchingOption = HASHTAG_OPTIONS.find(option => option.value === defaultValue);
    
    if (matchingOption) {
      return matchingOption;
    } else {
      // If no match, return the value as both label and value
      return { label: defaultValue, value: defaultValue };
    }
  };

  if (loading) {
    return <div>Loading...</div>;  // Show loading state while the design is being fetched
  }

  if (!design) {
    return <div>No design found.</div>;  // Handle the case where no design is found
  }

  return (
<Layout>
    <div className={styles3.page_container}>
      {/* Decorative Shapes */}
      <div className={styles3.pageDecoration}>
        <div className={styles3.pageShape1}></div>
        <div className={styles3.pageShape2}></div>
        <div className={styles3.pageShape3}></div>
        <div className={styles3.pageShape4}></div>
        <div className={styles3.pageShape5}></div>
        <div className={styles3.pageShape6}></div>
      </div>
      
    <header className={styles3.header}>
      <h1>Share Your Design with the World</h1>
      <p>Upload your creative designs and inspire others.</p>
    </header>
  
    <main className={styles3.main}>
      <div className={styles3.design_preview}>
        <div className={styles3.image_wrapper}>
          <img
            src={design.image_url}
            alt={`Design of ${design.modell}`}
            className={design.type === 'customed clear case'? styles3.clearimg : ''}
          />
        </div>
        <div className={styles3.design_details}>

        </div>
      </div>
  
      <div className={styles3.form_section}>
        <h2>Create Your Post</h2>
        <form onSubmit={handlePostSubmit} className={styles3.upload_form}>
          <div>
            <label htmlFor="caption">Caption</label>
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter a catchy title for your design"
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a brief description of your design"
              required
            />
          </div>
          
          <HashtagPicker
            defaultTag={getDefaultTag()}
            suggestions={getHashtagSuggestions()}
            onChange={setHashtags}
          />

          <button className={`${styles3.submit_button}  `} style={{width : '100%'}} type="submit">
            Share Now
          </button>
        </form>
        <div className={styles3.back_to_home}>
          <Link href="/">Go Back to Home</Link>
        </div>
      </div>
    </main>
  </div>
  
</Layout>
  
  );
};

export default DesignPage;

/*
      <div className="design-details">
        <p><strong>Model:</strong> {design.modell}</p>
        <p><strong>Type:</strong> {design.type}</p>
        <p><strong>Price:</strong> ${design.price}</p>
        <p><strong>SKU:</strong> {design.sku}</p>
        <p><strong>Stock:</strong> {design.stock}</p>
        <p><strong>Class:</strong> {design.theclass}</p>
      </div>

*/ 

'use client';
// app/other_profile/[userId]/page.tsx



import { useEffect, useState,useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Layout from '../../ordernow/layout';
import Link from 'next/link'
import styles1 from '../../profile/profile.module.css';
import styles from '../../fyp/fyp.module.css';
import { useRouter } from 'next/navigation';
import {
  fetchPublicPosts,
  fetchMostLikedDesigns,
  fetchMostAddedToCartDesigns,
  fetchRecentPosts,
  handleLike,
  handleFavorite,
  handleCommentSubmit,
  handleDeleteComment,
  addToCart,
  fetchLeaderboardData,
  fetchComments,
  Post,
  Comment,
  LeaderboardData,
  LeaderboardUser
} from '../../utils/apiUtils';


interface UserProfileProps {
  params: {
    userId: string;
  };
}




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



const UserProfilePage = ({ params }: UserProfileProps) => {
  const { userId } = params; // Get the userId from params
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]); // New state for posts
  
  const [selectedPost, setSelectedPost] = useState<any | null>(null); // Track the selected post
  const [commentContent, setCommentContent] = useState<string>("");
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);

  const slidersRef = useRef([]); // Array of refs to store each slider's ref
  const topRef = useRef<HTMLDivElement | null>(null);




const [userDesigns, setUserDesgins] = useState<any[]>([]);
const [selecteduserDesign, setSelecteduserDesign] = useState<any | null>(null); // Track the selected post


const [mostLiked, setMostLiked] = useState(false);
const [mostAddedToCart, setMostAddedToCart] = useState(false);
const [commentsVisible, setCommentsVisible] = useState(false);

const isFirstRender = useRef(true);
const [isFavorite, setIsFavorite] = useState(false);


const [historyStack, setHistoryStack] = useState([]);
const [theSavedDesign, setTheSavedDesign] = useState()

const [reportReason, setReportReason] = useState('');
const [showReportModal, setShowReportModal] = useState(false);
const [reportingType, setReportingType] = useState<'post' | 'comment' | null>(null);
const [reportingId, setReportingId] = useState<number | null>(null);

const router = useRouter()


useEffect(() => {
  if (isFirstRender.current && selectedPost) {
    // Scroll to the top if this is the first render of the selectedPost
    if (topRef.current) {
      topRef.current.scrollIntoView({
        behavior: 'auto', // Smooth scrolling
        block: 'start',     // Align to the top of the element
        inline: 'nearest',  // Prevent horizontal scrolling
      });
    }
    isFirstRender.current = false; // After the first render, set it to false
  }


}, [selectedPost])

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage

    console.log("Token in localStorage:", token); // Log to see if token exists in localStorage

    if (token) {
      try {
        const decodedToken = decodeJwt(token); // Decode the JWT manually
        console.log("Decoded Token:", decodedToken); // Log the decoded token structure

        // Set the loggedInUsername to the `user_id` from the token
        setLoggedInUsername(decodedToken.user_id.toString()); // You can use .toString() to make sure it's a string
      } catch (error) {
        console.error("Error decoding token", error); // Log any decoding errors
      }
    } else {
      console.log("No token found in localStorage"); // Log if no token is found
    }
  }, []); // Runs once when the component mounts

  useEffect(() => {
    console.log("Logged In Username: ", loggedInUsername); // Log whenever the loggedInUsername changes
  }, [loggedInUsername]); // Runs whenever loggedInUsername is updated












  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUserData(data);
      console.log(data)
    } catch (err) {
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch user posts
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userId}/posts/`);
      if (!response.ok) {
        throw new Error('Failed to fetch user posts');
      }
      const data = await response.json();
      setPosts(data); // Set the fetched posts
      console.log(data)
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };




  

  // UseEffect to fetch both user data and user posts when userId changes
  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetchUserData();
      fetchPosts(); // Fetch posts
      console.log(posts)
    }
  }, [userId]); // Fetch user data when userId changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  




 


  // Fetch comments for the selected post


  const scrollSlider = (direction, index) => {
    const slider = slidersRef.current[index];
    if (slider) {
      const scrollAmount = slider.clientWidth; // Scroll by the width of the visible area
      const currentScroll = slider.scrollLeft;

      if (direction === 'left') {
        slider.scrollTo({
          left: currentScroll - scrollAmount,
          behavior: 'smooth',
        });
      } else if (direction === 'right') {
        slider.scrollTo({
          left: currentScroll + scrollAmount + 10,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleBack = () => {
    if (historyStack.length > 0) {
      // Navigate back to the last post in the history stack
      const previousPost = historyStack[historyStack.length - 1];
      setHistoryStack((prevStack) => prevStack.slice(0, -1)); // Remove the last post
      setSelectedPost(previousPost);
      console.log("Navigated back, current post:", previousPost);
    } else {
      setSelectedPost(null); // If no history, go to homepage
      console.log("Navigated back to homepage");
    }
    isFirstRender.current = true; // Reset isFirstRender to true
    
  };


  const handleLike = async (postId: number) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      alert('You must be logged');
      window.location.href = '/login'; // or '/auth/login' if that's your route
      return;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/like/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    let data = {};
    try {
      if (response.status !== 204 && response.status !== 404) {
        data = await response.json();
      }
    } catch (error) {
      console.error("Failed to parse response as JSON:", error);
    }
  
    if (response.ok) {
      const newLikeState = data.message === "Like added." ? true : false;
      localStorage.setItem(`like_${postId}`, JSON.stringify(newLikeState)); // Persist state
      setSelectedPost((prevPost) => ({
        ...prevPost,
        like_count: data.message === "Like added." ? prevPost.like_count + 1 : prevPost.like_count - 1,
        is_liked: newLikeState,
      }));
    } else {
      console.error("Error toggling like:", data);
    }
  };
  
  const handleFavorite = async (postId: number) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('You must be logged');
      window.location.href = '/login'; // or '/auth/login' if that's your route
      return;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/favorite/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    let data = {};
    try {
      if (response.status !== 204 && response.status !== 404) {
        data = await response.json();
      
      }
    } catch (error) {
      console.error("Failed to parse response as JSON:", error);
    }
  
    if (response.ok) {
      setIsFavorite((prevState) => !prevState);
      const newFavoriteState = data.message === "Favorite added." ? true : false;
      localStorage.setItem(`favorite_${postId}`, JSON.stringify(newFavoriteState)); // Persist state
      setSelectedPost((prevPost) => ({
        ...prevPost,
        favorite_count: data.message === "Favorite added." ? prevPost.favorite_count + 1 : prevPost.favorite_count - 1,
        is_favorite: newFavoriteState,
      }));
    } else {
      console.error("Error toggling favorite:", data);
    }
  };
  

  const handleCommentSubmitClick = async (postId: number) => {
    try {
const response = await handleCommentSubmit(postId, commentContent);

setSelectedPost(prev => {
if (!prev) return null;
return {
  ...prev,
  comments: [...(prev.comments || []), response.comment]
};
});

setPosts(prev => prev.map(post => 
post.id === postId
  ? { ...post, comments: [...(post.comments || []), response.comment] }
  : post
));

setCommentContent("");
setCommentsVisible(true);
    } catch (error) {
console.error("Error adding comment:", error);
    }
};


const handleAddToCart = async (designId: number) => {
  try {
    await addToCart(designId);
    // Show success message
    alert("Item added to cart successfully!");
  } catch (error) {
    // Handle the "already in cart" error specifically
    if (error instanceof Error && error.message === "This item is already in your cart.") {
      alert("This item is already in your cart.");
    } else {
      // Handle other errors
      alert("Failed to add item to cart. Please try again.");
    }
  }
};

const handleDeleteCommentClick = async (postId: number, commentId: number) => {
try {
await handleDeleteComment(commentId);

setSelectedPost(prev => {
if (!prev) return null;
return {
  ...prev,
  comments: prev.comments?.filter(comment => comment.id !== commentId) || []
};
});

setPosts(prev => prev.map(post => 
post.id === postId
  ? { ...post, comments: post.comments?.filter(comment => comment.id !== commentId) || [] }
  : post
));
} catch (error) {
console.error("Error deleting comment:", error);
}
};

const handleLikeClick = async (postId: number) => {
try {
const response = await handleLike(postId);
const newLikeState = response.message === "Like added.";

setSelectedPost(prev => {
if (!prev) return null;
return {
  ...prev,
  like_count: newLikeState ? prev.like_count + 1 : prev.like_count - 1,
  is_liked: newLikeState
};
});

setPosts(prev => prev.map(post => 
post.id === postId
  ? { ...post, like_count: newLikeState ? post.like_count + 1 : post.like_count - 1, is_liked: newLikeState }
  : post
));
} catch (error) {
console.error("Error toggling like:", error);
}
};

const handleFavoriteClick = async (postId: number) => {
try {
const response = await handleFavorite(postId);
const newFavoriteState = response.message === "Favorite added.";

setSelectedPost(prev => {
if (!prev) return null;
return {
  ...prev,
  favorite_count: newFavoriteState ? prev.favorite_count + 1 : prev.favorite_count - 1,
  is_favorite: newFavoriteState
};
});

setPosts(prev => prev.map(post => 
  post.id === postId
  ? { ...post, favorite_count: newFavoriteState ? post.favorite_count + 1 : post.favorite_count - 1, is_favorite: newFavoriteState }
    : post
));
} catch (error) {
console.error("Error toggling favorite:", error);
}
};
  // Fetch comments for the selected post
  const fetchComments = async (postId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/comments/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch comments.");
      }

      const data = await response.json();
      return data.comments || []; // Return the comments array instead of setting state
    } catch (error) {
      console.log("Error fetching comments:", error);
      return []; // Return empty array in case of error
    }
  };

  const handlePostClick = async (post: Post) => {
    setSelectedPost(post);
    try {
      const comments = await fetchComments(post.id);
      setSelectedPost(prev => prev ? { ...prev, comments } : null);
      // Scroll after the post content is loaded
      const selectedPostElement = document.querySelector(`.${styles.selectedClearDesignBox}`);
      if (selectedPostElement) {
        selectedPostElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
    setHistoryStack(prev => [...prev, selectedPost as Post]);
  };
  
  // Fetch comments for the selected post
  

  const handleReport = async (type: 'post' | 'comment', id: number) => {
    setReportingType(type);
    setReportingId(id);
    setShowReportModal(true);
  };

  const handleReportSubmit = async () => {
    if (!reportReason || !reportingType || !reportingId) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to submit a report');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content_id: reportingId,
          content_type: reportingType,
          reason: reportReason,
        }),
      });

      if (response.ok) {
        alert('Report submitted successfully');
        setShowReportModal(false);
        setReportReason('');
        setReportingType(null);
        setReportingId(null);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report');
    }
  };
  

 




const addToCart = async (designId : any) => {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('You must be logged');
      window.location.href = '/login'; // or '/auth/login' if that's your route
      return;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("token")}`,

      },
      body: JSON.stringify({ design_id: designId }),
    });

    if (response.ok) {
      alert('Item added to cart!');
    } else {
      const data = await response.json();
      alert(data.error);
    }
  };

  const profilePicUrl = userData?.profile_pic || 'https://res.cloudinary.com/daalfrqob/image/upload/v1730076406/default-avatar-profile-trendy-style-social-media-user-icon-187599373_jtpxbk.webp';


  if (selectedPost) {
    // Check if selectedPost is an array or an object
    const post = Array.isArray(selectedPost) ? selectedPost[0] : selectedPost;
  
    // Access 'design' dynamically (in case 'design' is inside 'post' or 'post' inside 'design')
    const postDesign = post.design ? post.design : post.post ? post.post.design : null;
  
    if (!postDesign) return <p>No design data available</p>;  // Handle case if no design data exists
  
    // Filter posts with the same 'theclass'
    const sameTypePosts = posts.filter(postItem => postItem.design?.theclass === postDesign.theclass);
    
    // Filter posts with the same 'theclass' but same type
    const sameClassSameTypePosts = sameTypePosts.filter(postItem => postItem.design?.type === postDesign.type);
    
    // Filter posts with the same 'theclass' but different type
    const sameClassDifferentTypePosts = sameTypePosts.filter(postItem => postItem.design?.type !== postDesign.type);
  
    return (
      <Layout>
      <div style={{ padding: "16px", position: "relative" }} className={styles.selectedClearDesignBox}>
      <div>
        <button onClick={handleBack} className={styles.backb}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className={post.design.type === 'customed rubber case' ? styles.selectedRubberDesignMain : styles.selectedClearDesignMain}>
          <div className={post.design.type === 'customed rubber case' ? styles.rubberr : styles.clear}>
            <img
              src={post.design.image_url}
              className={post.design.type === 'customed rubber case' ? styles.rubber : styles.clear}
              alt={`Post ${post.id}`}
              style={{ paddingLeft: post.design.type === 'customed rubber case' ? "0px" : "0%", height: "auto" }}
            />
          </div>
          <div style={{ marginTop: "24px", height: "300px" }}>
            <div className={styles.commentDropdown}>
              <button
                onClick={() => setCommentsVisible(!commentsVisible)}
                className={styles.dropdownButton}
              >
                {commentsVisible ? "Hide Reviews" : "Show Reviews"}
              </button>
              <div className={`${styles.commentsContainer} ${commentsVisible ? styles.open : styles.closed}`}>
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment) => {
                    console.log("LoggedInUsername:", loggedInUsername, "Comment User ID:", comment.user_id);
                    return (
                      <div className={styles.commentsection} key={comment.id}>
                        <p>
                          <span>
                            <img className={styles.discprofile_pic} src={`${comment.profile_pic}`} alt="" />
                            {comment.first_name}:
                          </span>
                          <span>{comment.content}</span>
                          <div className={styles.commentActions}>
                            {String(comment.user_id) === String(loggedInUsername) && (
                              <button
                                onClick={() => handleDeleteCommentClick(post.id, comment.id)}
                                className={styles.deleteButton}
                                title="Delete comment"
                                style={{
                                marginLeft: "8px",
                                color: "red",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }} 
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            )}
                            {String(comment.user_id) !== String(loggedInUsername) && (
                              <button
                                onClick={() => handleReport('comment', comment.id)}
                                className={styles.reportButton}
                                title="Report comment"
                              >
                                <i className="fas fa-flag"></i>
                              </button>
                            )}
                          </div>
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={post.design.type === 'customed rubber case' ? styles.rubberInfos : styles.clearInfos}>
          <div className={styles.postText1}>
            <h3 style={{ color: "var(--secondColor)" }}>{post.caption}</h3>
            <h1><img src={`${post.profile_pic}`} className={styles.discprofile_pic} alt="" />Designed By <Link href={`/other_profile/${post.user_id}`} style={{ color: "var(--thirdColor)" }}>{post.first_name}</Link></h1>
          </div>

          <div className={styles.phoneFetures}>
            <ul>
              <li>Shock Absorption: Protects the phone from accidental drops and impacts.</li>
              <li>Scratch Resistance: Keeps the phone and the case itself free from scratches.</li>
              <li>High-Quality Build: Materials like TPU, polycarbonate, or leather ensure longevity.</li>
              <li>Adds minimal bulk to the phone for easy portability.</li>
              <li>Maintains the phone's sleek design while offering protection.</li>
              <li>Edge-to-Edge Coverage: Covers all sides, corners, and back.</li>
              <li>Raised Edges: Protects the screen and camera from direct contact with surfaces.</li>
              <li>Dust and Water Resistance: Shields against minor spills and dust particles.</li>
              <li><p className="mt-3">Model: {post.design.modell[2] === 'o' ? post.design.modell.slice(0, 2) + post.design.modell.slice(3) : post.design.modell}</p></li>
              <li><p>Type: {post.design.type}</p></li>
              <li><p style={{ fontWeight: "bolder" }}>Price: {post.design.price}$</p></li>
            </ul>
          </div>

          <div className={styles.postText2}>
            <p>{post.description}</p>
          </div>

          <div className={styles.timer}>
            <span>Posted At: {new Date(post.created_at).toLocaleString()}</span>
            <div className={styles.postActions}>
            {String(post.user_id) !== String(loggedInUsername) && (
              <button
                onClick={() => handleReport('post', post.id)}
                className={styles.reportButton}
                title="Report post"
              >
                <i className="fas fa-flag"></i>
                <span>Report Post</span>
              </button>
              )}
            </div>
          </div>

          <div className={`${styles.holebuttonH}`}>
            <div className={styles.postbuttonHolder}>
              <button
                className={`${styles.likebtn} ${post.is_liked ? styles.liked : ""}`}
                onClick={() => handleLikeClick(post.id)}
              >
                <i className={post.is_liked ? "fas fa-heart" : "far fa-heart"}></i>
                <span>{post.is_liked ? "Liked" : "Like"}</span>
                <h4>{post.like_count}</h4>
              </button>

              <button
                className={`${styles.likebtn} ${post.is_favorite ? styles.liked : ""}`}
                onClick={() => handleFavoriteClick(post.id)}
              >
                <i className={post.is_favorite ? "fas fa-star" : "far fa-star"}></i>
                <span>{post.is_favorite ? "Saved" : "Save"}</span>
                <h4>{post.favorite_count}</h4>
              </button>

              <button
                className={styles.btn5}
                onClick={() => handleAddToCart(post.design.id)}
              >
                <i className="fas fa-shopping-cart"></i>
                Add to cart
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', width: '100%' }}>
            <input
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add a comment..."
            />
            <button
              onClick={() => handleCommentSubmitClick(post.id)}
              className={`${styles.addcommentbtn}`}
            >
              Add Comment
            </button>
          </div>
        </div>
      </div>
      {sameClassSameTypePosts.filter(post => post.id !== selectedPost?.id).length > 0 && (
          <section className={styles.viewsection}>
            <h2>Same Type</h2>
            <div className={styles.sliderContainer}>
              <button className={styles.scrollButton} onClick={() => scrollSlider('left', 0)}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <div className={styles.viewsectionD} ref={(el) => (slidersRef.current[0] = el)}>
                {sameClassSameTypePosts.filter(post => post.id !== selectedPost?.id).map((post) => (
                  <div key={post.id} className={styles.cards}>
                    <div className={styles.imgBack} onClick={() => handlePostClick(post)}>
                      <img
                        src={post.design.image_url}
                        alt={`Post ${post.id}`}
                        className={post.design.type === 'customed rubber case' ? styles.instockwidth : styles.outstockwidth}

                        style={{ borderRadius: '8px' }}
                      />
                    </div>
                    <div className={styles.cardsContent} onClick={() => handlePostClick(post)}>
                      <h2 className={styles.title}>{post.design.modell}</h2>
                      <p className={styles.disc}>{post.design.type}</p>
                      <p className={styles.disc}>By: {post.first_name}</p>
                      <p className={styles.title2}>Price: {post.design.price}$</p>
                    </div>
                    <button className={styles.btn5} onClick={() => handleAddToCart(post.design.id)}>
                      Add to cart
                    </button>
                  </div>
                ))}
              </div>
              <button className={styles.scrollButton} onClick={() => scrollSlider('right', 0)}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </section>
        )}
  
        {/* Different Type Section */}
        {sameClassDifferentTypePosts.filter(post => post.id !== selectedPost?.id).length > 0 && (
          <section className={styles.viewsection}>
            <h2>Other Types</h2>
            <div className={styles.sliderContainer}>
              <button className={styles.scrollButton} onClick={() => scrollSlider('left', 1)}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <div className={styles.viewsectionD} ref={(el) => (slidersRef.current[1] = el)}>
                {sameClassDifferentTypePosts.filter(post => post.id !== selectedPost?.id).map((post) => (
                  <div key={post.id} className={styles.cards}>
                    <div className={styles.imgBack} onClick={() => handlePostClick(post)}>
                      <img
                        src={post.design.image_url}
                        alt={`Post ${post.id}`}
                        className={post.design.type === 'customed rubber case' ? styles.instockwidth : styles.outstockwidth}

                        style={{ borderRadius: '8px' }}
                      />
                    </div>
                    <div className={styles.cardsContent} onClick={() => handlePostClick(post)}>
                      <h2 className={styles.title}>{post.design.modell}</h2>
                      <p className={styles.disc}>{post.design.type}</p>
                      <p className={styles.disc}>By: {post.first_name}</p>
                      <p className={styles.title2}>Price: {post.design.price}$</p>
                    </div>
                    <button className={styles.btn5} onClick={() => handleAddToCart(post.design.id)}>
                      Add to cart
                    </button>
                  </div>
                ))}
              </div>
              <button className={styles.scrollButton} onClick={() => scrollSlider('right', 1)}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </section>
        )}
      {showReportModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Report {reportingType === 'post' ? 'Post' : 'Comment'}</h3>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please provide a reason for reporting..."
              className={styles.reportTextarea}
            />
            <div className={styles.modalActions}>
              <button onClick={() => setShowReportModal(false)} className={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={handleReportSubmit} className={styles.submitButton}>
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
}


  

  return (
    <Layout>
<div className={styles1.profile_container}>
    <div className={styles1.profile_header}>
        <img src={profilePicUrl} alt="Profile" className={styles1.profile_pic} />
        <h1 className={styles1.profile_title}>{userData?.username}</h1>
    </div>
    <div className={styles1.profile_info}>
    <div className={styles1.profile_info_item}>
            <span className={styles1.profile_label}>First Name:</span>
            <span className={styles1.profile_value}>{userData?.first_name}</span>
        </div>

        <div className={styles1.profile_info_item}>
            <span className={styles1.profile_label}>Last Name:</span>
            <span className={styles1.profile_value}>{userData?.last_name}</span>
        </div>

        <div className={styles1.profile_info_item}>
            <span className={styles1.profile_label}>Username:</span>
            <span className={styles1.profile_value}>@{userData?.username}</span>
        </div>
        <div className={styles1.profile_info_item}>
            <span className={styles1.profile_label}>Email:</span>
            <span className={styles1.profile_value}>{userData?.email}</span>
        </div>
    </div>
</div>



    
<div className={styles1.fullWidthPostsContainer}>
    
    {posts && posts.length > 0 ? (
      posts.map((post) => (
        <div key={post.id} className={styles1.fullWidthPost}>
          {/* Image Section */}
          <div className={styles1.fullWidthImageContainer} onClick={() => handlePostClick(post)}>
            <img
              src={post.design.image_url}
              alt={`Post ${post.id}`}
              className={post.design.type === 'customed rubber case' ? styles1.rubberimg : styles1.clearimg}
            />
          </div>
  
          {/* Content Section */}
          <div className={styles1.fullWidthPostBody}>
            {/* Title and Description */}
            <div className={styles1.header}>
              <h2 className={styles1.fullWidthPostTitle}>{post.design.modell}</h2>
              <p className={styles1.fullWidthPostDescription}>{post.description}</p>
            </div>
  
            {/* User Info */}
            <div className={styles1.userInfo}>
              <img
                src={post.profile_pic}
                alt="User Profile"
                className={styles1.userAvatar}
              />
              <span className={styles1.userName}>{post.first_name}</span>
            </div>
  
            {/* Metadata and Actions */}
            <div className={styles1.postDetails}>
              <div className={styles1.interaction}>
                <span className={styles1.likes}>{post.like_count} Likes</span>
                <span className={styles1.comments}>{post.comment_count} Comments</span>
                <span className={styles1.favorites}>{post.favorite_count} Favorites</span>
              </div>
              <div className={styles1.priceAndStock}>
                <span className={post.design.stock === 'In Stock' ? styles1.inStock : styles1.outStock}>
                  {post.design.stock === 'In Stock' ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className={styles1.price}>{post.design.price}$</span>
              </div>
            </div>
  
            {/* Add to Cart Button */}
  
          </div>
        </div>
      ))
    ) : (
      <p>No posts available</p>
    )}
  </div>
    </Layout>
  );
};

export default UserProfilePage;

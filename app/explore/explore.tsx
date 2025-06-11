'use client';
import { useState, useEffect, useRef } from 'react';
import Layout from '../fyp/layout';
import { useRouter } from 'next/navigation';
import styles from '../fyp/fyp.module.css';
import styles1 from './explore.module.css';
import Link from 'next/link'
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
} from '../utils/apiUtils';

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

export default function Explore() {
    const images = [
        'Leonardo_Phoenix_09_A_series_of_visually_striking_and_vibrant_0.jpg',
        'Leonardo_Phoenix_09_A_vibrant_collection_of_lifestyle_images_s_1.jpg',
        'Leonardo_Phoenix_09_A_visually_striking_slider_image_set_in_a_1.jpg',
        'Leonardo_Phoenix_09_Vibrant_highenergy_images_featuring_custom_1.jpg',
        'Leonardo_Phoenix_09_A_visually_striking_slider_image_for_a_dar_3.jpg',
        'Leonardo_Phoenix_09_Vibrant_highquality_images_depicting_whims_1.jpg',
    ]; // Replace with your image URLs

    const [currentIndex, setCurrentIndex] = useState(0);
    const [posts, setPosts] = useState<Post[]>([]);
    const [mostLikedPosts, setMostLikedPosts] = useState<Post[]>([]);
    const [mostAddedToCartPosts, setMostAddedToCartPosts] = useState<Post[]>([]);
    const [recentPosts, setRecentPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [historyStack, setHistoryStack] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loggedInUsername, setLoggedInUsername] = useState<number | null>(null);
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>({ likesData: [], postsData: [] });
    const topRef = useRef<HTMLDivElement>(null);
    const slidersRef = useRef<(HTMLDivElement | null)[]>([]);
    const isFirstRender = useRef(true);
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [commentContent, setCommentContent] = useState<string>("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportingType, setReportingType] = useState<'post' | 'comment' | null>(null);
    const [reportingId, setReportingId] = useState<number | null>(null);
    const router = useRouter()
    /*
      useEffect(()=>{
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if there's no token
            router.push('/login');
            return;
        } 
      },[router])
*/
  const handleCategoryClick = (category: string) => {
    router.push(`/category/${encodeURIComponent(category)}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
}, [images.length]);

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
 useEffect(() => {
    const fetchData = async () => {
      try {
        const [publicPosts, likedDesigns, cartDesigns] = await Promise.all([
          fetchPublicPosts(),
          fetchMostLikedDesigns(),
          fetchMostAddedToCartDesigns()
        ]);

        setPosts(publicPosts);
        setMostLikedPosts(likedDesigns);
        setMostAddedToCartPosts(cartDesigns);
      } catch (error) {
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

   useEffect(() => {
    const loadData = async () => {
        try {
        const data = await fetchLeaderboardData();
        setLeaderboardData(data);
        } catch (error) {
        console.error('Error loading leaderboard data:', error);
        }
      };
    
    loadData();
    }, []);
  
      useEffect(() => {
    const loadRecentPosts = async () => {
          try {
        const data = await fetchRecentPosts();
        setRecentPosts(data);
        setLoading(false);
          } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to load recent posts");
        }
        setLoading(false);
      }
    };

    loadRecentPosts();
    }, []);
  
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


  const handleBack = () => {
    if (historyStack.length > 1) {
      // Remove the current post from the stack
      const newStack = [...historyStack];
      newStack.pop();
      // Set the previous post as selected
      setSelectedPost(newStack[newStack.length - 1]);
      setHistoryStack(newStack);
    } else {
      // If there's only one post in the stack, clear the selection
      setSelectedPost(null);
      setHistoryStack([]);
    }
  };

  const scrollSlider = (direction: 'left' | 'right', index: number) => {
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
    if (loading) return <div>Loading...</div>;






    const filteredPosts = {
        anime: posts.filter(post => post.design && post.design.theclass === 'Anime & Manga'),
        cartoons: posts.filter(post => post.design && post.design.theclass === 'Cartoons & Animated Characters'),
        pets: posts.filter(post => post.design && post.design.theclass === 'Cats & Dogs'),
        tvShows: posts.filter(post => post.design && post.design.theclass === 'TV Shows & Movies'),
        motivational: posts.filter(post => post.design && post.design.theclass === 'Motivational & Inspirational'),
        memeBased: posts.filter(post => post.design && post.design.theclass === 'Funny & Meme-Based'),
        pop : posts.filter(post => post.design && post.design.theclass === 'Pop Culture & Music'),



      };




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
            
            <div className={styles1.sliderContainer}>
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={styles1.image}
                        style={{
                            backgroundImage: `url(${image})`,
                            opacity: currentIndex === index ? 1 : 0,
                            zIndex: currentIndex === index ? 1 : 0,
                        }}
                    />
                ))}

                <div className={styles1.dotsContainer}>
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`${styles1.dot} ${currentIndex === index ? styles1.activeDot : ''}`}
                            onClick={() => setCurrentIndex(index)} // Set image when dot is clicked
                        />
                    ))}
                </div>
            </div>


            <div className={styles1.usermaincontainer}>
      <h2 style={{color :  'var(--secondColor)'}}>Most Popular Users</h2>
      <div className={styles1.usercontainer}>
      {leaderboardData.likesData.map((user) => (
        
  <div className={styles1.user_card} key={user.user_id}>
    {/* Profile Section */}
    <div className={styles1.profile_section}>
      <img src={user.profile_pic} alt="Profile" className={styles1.profile_pic} />
      <div className={styles1.user_info}>
        <h3 className={styles1.username}>{`${user.first_name} ${user.last_name}`}</h3>
        <p className={styles1.user_id}>@{user.username}</p>
      </div>
    </div>

    {/* Likes and Bio Section */}
    <div className={styles1.likes_section}>
        <div className={styles1.total}>
      <p>
        <span className={styles1.likes_count}>{user.total_likes}</span> Likes
        
      </p>
      <p><span className={styles1.likes_count}>{user.total_posts}</span> Posts</p>
      </div>
      <p className={styles1.bio}>
        "Creative thinker, designer, and tech enthusiast. Always chasing inspiration."
      </p>
    </div>

    {/* Follow Button */}


    {/* Hover Details Section */}
    <div className={styles1.hover_section}>
      <h4>Contact Info</h4>
      <p>Email: {user.email}</p>
      <Link href={loggedInUsername === user.user_id ? 'profile/' : `other_profile/${user.user_id}`}>
      <button className={styles1.follow_btn}>
    <i className="fas fa-door-closed"></i>Visit Profile
    </button>
    </Link>
    </div>
  </div>
  
))}
</div>


    </div>

<div className={styles1.usermaincontainer1} >
        <h2 style={{color : 'var(--secondColor)'}}>Top Users by Posts</h2>
        <div className={styles1.usercontainer}>
          {leaderboardData.postsData.map((user) => (
  <div className={styles1.user_card} key={user.user_id}>
  {/* Profile Section */}
  <div className={styles1.profile_section}>
    <img src={user.profile_pic} alt="Profile" className={styles1.profile_pic} />
    <div className={styles1.user_info}>
      <h3 className={styles1.username}>{`${user.first_name} ${user.last_name}`}</h3>
      <p className={styles1.user_id}>@{user.username}</p>
    </div>
  </div>

  {/* Likes and Bio Section */}
  <div className={styles1.likes_section}>
      <div className={styles1.total}>

    <p><span className={styles1.likes_count}>{user.total_posts}</span> Posts</p>
    <p>
      <span className={styles1.likes_count}>{user.total_likes}</span> Likes
      
    </p>
    </div>
    <p className={styles1.bio}>
      "Creative thinker, designer, and tech enthusiast. Always chasing inspiration."
    </p>
  </div>

  {/* Follow Button */}


  {/* Hover Details Section */}
  <div className={styles1.hover_section}>
    <h4>Contact Info</h4>
    <p>Email: {user.email}</p>
    <Link href={loggedInUsername === user.user_id ? 'profile/' : `other_profile/${user.user_id}`}>
    <button className={styles1.follow_btn}>
  <i className="fas fa-door-closed"></i>Visit Profile
  </button>
  </Link>
  </div>
</div>
          ))}
        </div>
      </div>

            <section className={styles.viewsection}>
  <h2>Most Recent</h2>
  <div className={styles.sliderContainer}>
    {/* Left Scroll Button */}
    <button
      className={` ${styles.scrollButton}`}
      onClick={() => scrollSlider('left',0)}
    >
      <i className="fas fa-chevron-left"></i> {/* Left arrow */}
    </button>

    {/* Card Container */}
    <div className={styles.viewsectionD} ref={(el: HTMLDivElement | null): void => {
      slidersRef.current[0] = el;
    }}>
      {recentPosts.map((post) => (
        <div key={post.id} className={`${styles.cards}`}>
          <div
            className={styles.imgBack}
            onClick={() => handlePostClick(post)}
          >
            <img
              src={post.design.image_url}
              alt={`Post ${post.id}`}
              className={
                post.design.type === 'customed rubber case'
                  ? styles.instockwidth
                  : styles.outstockwidth
              }
              style={{
                borderRadius: '8px',
              }}
            />
          </div>

          <div
            className={styles.cardsContent}
            onClick={() => handlePostClick(post)}
          >
            <h2 className={`${styles.title}`}>
              {post.design.modell[2] === 'o'
                ? post.design.modell.slice(0, 2) + post.design.modell.slice(3)
                : post.design.modell}
            </h2>
            <p className={`${styles.disc}`}>{post.design.type}</p>
            <p className={`${styles.disc}`}>
              By :{' '}
              <img
                src={`${post.profile_pic}`}
                className={styles.discprofile_pic}
                alt=""
              />{' '}
              {post.first_name}
            </p>
            <p className={`${styles.title2}`}>
              Price : {post.design.price}$
            </p>
          </div>
          <button
            className={styles.btn5}
            onClick={() => handleAddToCart(post.design.id)}
          >
            Add to cart
          </button>
        </div>
      ))}
    </div>

    {/* Right Scroll Button */}
    <button
      className={styles.scrollButton}
      onClick={() => scrollSlider('right',0)}
    >
       <i className="fas fa-chevron-right"></i> {/* Right arrow */}
    </button>
  </div>
</section>












<div className={styles1.maincatagorycontainer}>
      <h2>Categories</h2>
      <div className={styles1.catagorycontainer}>

        <div onClick={() => handleCategoryClick('Anime & Manga')}>
          <img src="TheStyle/a18a18b86d846dff18040ede68ac0701.jpg" alt="anime" />
        </div>

        <div onClick={() => handleCategoryClick('Funny & Meme-Based')}>
          <img src="TheStyle/images.png" alt="meme" />
        </div>

        <div onClick={() => handleCategoryClick('Motivational & Inspirational')}>
          <img src="TheStyle/motivation-typography-crumble-font_53876-104952.avif" alt="motivation" />
        </div>

        <div onClick={() => handleCategoryClick('Cartoons & Animated Characters')}>
          <img src="TheStyle/6ba8d6051be2d9281e4248f3e368ee42.jpg" alt="cartoon" />
        </div>

      </div>
    </div>
        </Layout>
    );
}

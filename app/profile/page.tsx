"use client";
import { useEffect, useState,useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles1 from './profile.module.css';
import styles2 from '../createrubber/rubber.module.css';
import styles from '../fyp/fyp.module.css';
import styles3 from '../BuyingChart/chart.module.css'
import Link from 'next/link'

import Layoutt from '../fyp/layout';
import { Fugaz_One } from 'next/font/google';
import { div } from 'three/webgpu';
export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null); // Track the selected post
  const [commentContent, setCommentContent] = useState<string>("");

const [userDesigns, setUserDesgins] = useState<any[]>([]);
const [selecteduserDesign, setSelecteduserDesign] = useState<any | null>(null); // Track the selected post

  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const [mostLiked, setMostLiked] = useState(false);
  const [mostAddedToCart, setMostAddedToCart] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);

  const isFirstRender = useRef(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const slidersRef = useRef([]); // Array of refs to store each slider's ref
  const topRef = useRef<HTMLDivElement | null>(null);

const [historyStack, setHistoryStack] = useState([]);
const [showAllClearCases, setShowAllClearCases] = useState(false);
const [showAllRubberCases, setShowAllRubberCases] = useState(false);
const scrollTargetRef = useRef(null);



  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });




const [theSavedDesign, setTheSavedDesign] = useState()
    const router = useRouter();
 

      const handleGoToAdminPage = () => {
    router.push('/adminDash')
  }
    const handleShowMore = () => {
      setShowAllClearCases(true);
      setTimeout(() => {
        scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };
    const handleShowMore2 = () => {
      setShowAllRubberCases(true);
      setTimeout(() => {
        scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
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



  useEffect(() => {
    if (isFirstRender.current && theSavedDesign) {
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


  }, [theSavedDesign])



   useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }

      try {
        // Fetch user designs
        const designsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-designs/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!designsRes.ok) throw new Error("Failed to fetch designs.");
        const designsData = await designsRes.json();
        setUserDesgins(designsData.designs || []);

        // Fetch user profile
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get-user-profile/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileRes.ok) throw new Error("Failed to fetch user profile.");
        const profileData = await profileRes.json();
        setUserData(profileData);
        setEditData({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          email: profileData.email,
        });
      } catch (err) {
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

const handleSave = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No auth token found");
    return;
  }

  const confirmed = window.confirm("Are you sure you want to save the changes?");
  if (!confirmed) return;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update-profile/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editData),
    });

    if (!res.ok) throw new Error("Update failed.");

    // ✅ Reload the entire page after successful update
    window.location.reload();
  } catch (err) {
    console.error("Update failed:", err);
  }
};


  useEffect(() => {
    if (selectedPost) {
      const likeState = localStorage.getItem(`like_${selectedPost.id}`);
      const favoriteState = localStorage.getItem(`favorite_${selectedPost.id}`);
      const updatedPost = { ...selectedPost };
  
      if (likeState) {
        updatedPost.is_liked = JSON.parse(likeState);
      }
      if (favoriteState) {
        updatedPost.is_favorite = JSON.parse(favoriteState);
      }
  
      // Only update state if there are changes
      if (
        updatedPost.is_liked !== selectedPost.is_liked ||
        updatedPost.is_favorite !== selectedPost.is_favorite
      ) {
        setSelectedPost(updatedPost);
      }
    }
  }, [selectedPost]);

  
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
          setSelectedPost((prevPost) => ({
            ...prevPost,
            comments: data.comments || [], // Assuming response contains an array of comments
          }));
        } catch (error) {
          console.log("Error fetching comments:", error);
        }
      };

      

      const handleCommentSubmit = async (postId: number) => {
        if (!commentContent) {
          console.log("Comment content is required.");
          return;
        }
    
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/comment/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            content: commentContent, // Pass the comment content
          }),
    
        });
    
        if (response.ok) {
          const data = await response.json();
    
          // Update both posts and selectedPost
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    comments: Array.isArray(post.comments)
                      ? [...post.comments, data.comment]
                      : [data.comment],
                  }
                : post
            )
          );
    
          // Also update the selectedPost directly to reflect the changes
          setSelectedPost((prevPost) =>
            prevPost && prevPost.id === postId
              ? {
                  ...prevPost,
                  comments: Array.isArray(prevPost.comments)
                    ? [...prevPost.comments, data.comment]
                    : [data.comment],
                }
              : prevPost
          );
    
          setCommentContent(""); // Reset comment input field
        } else {
          console.log("Error adding comment:", await response.text());
        }
        setCommentsVisible(true)
      };
    
      const handleDeleteComment = async (postId: number, commentId: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/${commentId}/delete/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
    
        if (response.ok) {
          // Update both posts and selectedPost to remove the deleted comment
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    comments: Array.isArray(post.comments)
                      ? post.comments.filter((comment: any) => comment.id !== commentId)
                      : [],
                  }
                : post
            )
          );
    
          setSelectedPost((prevPost) =>
            prevPost && prevPost.id === postId
              ? {
                  ...prevPost,
                  comments: Array.isArray(prevPost.comments)
                    ? prevPost.comments.filter((comment: any) => comment.id !== commentId)
                    : [],
                }
              : prevPost
          );
        } else {
          console.log("Error deleting comment");
        }
      };



    const addToCart = async (designId : any) => {
        const token = localStorage.getItem('token')
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

      

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if there's no token
            router.push('/login');
            return;
        }

        // Fetch profile data
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            setUserData(data);
            console.log(data);
        })
        .catch(error => console.log("Error fetching profile:", error));
    }, [router]);

    // Fetch posts data after userData is set
    useEffect(() => {
        if (!userData) return; // Don't fetch posts until userData is available

        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if there's no token
            router.push('/login');
            return;
        }

        // Fetch user's posts data
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userData.id}/posts/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            setPosts(data); // Set the fetched posts
            console.log(data);
        })
        .catch(error => console.log("Error fetching posts:", error));
    }, [userData]); // Trigger when userData changes

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


      const handlePostClick = (post: any) => {
        setSelectedPost(post);
        fetchComments(post.id);
      setHistoryStack((prevStack) => [...prevStack, selectedPost]);
      
        // Ensure the ref is not null
         if (topRef.current) {
        // Ensure smooth scrolling only in the vertical direction
        topRef.current.scrollIntoView({
          behavior: 'smooth', // Smooth scrolling
          block: 'start',     // Align to the top of the element
          inline: 'nearest',  // Prevent horizontal scrolling
        });
        console.log(selectedPost)
      }
      };

      const handleDesignClick = async (design: any) => {
        setSelecteduserDesign(design); // Save the selected design to state
        const token = localStorage.getItem("token");
      
        try {
          // Fetch detailed design data
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/design/${design.id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log("Fetched Design:", data.price); // Log the fetched design data
            setTheSavedDesign(data); // Update the state with the fetched design
          } else {
            console.error("Failed to fetch design data");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false); // Stop loading spinner or indicator
        }
      
        // Smooth scrolling to the top
        if (topRef.current) {
          topRef.current.scrollIntoView({
            behavior: "smooth", // Smooth scrolling
            block: "start",     // Align to the top of the element
            inline: "nearest",  // Prevent horizontal scrolling
          });
        }
      };
      function handDesignleBack(){
        setTheSavedDesign(null)
      }

    if (!userData) return <p>Loading profile...</p>;



// services/api.js

const deleteDesign = async (designId) => {
    const token = localStorage.getItem('token');
    
    // Ask for confirmation before deleting
    const isConfirmed = window.confirm("Are you sure you want to delete this design?");
    
    if (!isConfirmed) {
        return; // Exit if the user cancels
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/designs/${designId}/delete/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || 'Failed to delete design');
        }

        // Successfully deleted
        alert('Design deleted successfully'); // Feedback to user

        // Refresh the page
        window.location.reload();

    } catch (error) {
        console.error(error);
        alert(`Error: ${error.message}`); // Display error to user
    }
};

const deletePost = async (postId) => {
    const token = localStorage.getItem('token');
    
    // Ask for confirmation before deleting
    const isConfirmed = window.confirm("Are you sure you want to delete this post?");
    
    if (!isConfirmed) {
        return; // Exit if the user cancels
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${postId}/delete/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || 'Failed to delete post');
        }

        // Successfully deleted
        alert('Post deleted successfully'); // Feedback to user

        // Refresh the page
        window.location.reload();

    } catch (error) {
        console.error(error);
        alert(`Error: ${error.message}`); // Display error to user
    }
};



    // Use the Cloudinary URL directly from userData.profile_pic
    const profilePicUrl = userData.profile_pic || 'https://res.cloudinary.com/daalfrqob/image/upload/v1730076406/default-avatar-profile-trendy-style-social-media-user-icon-187599373_jtpxbk.webp';




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
            <Layoutt>
          <div style={{ padding: "16px", position: "relative" }} className={styles.selectedClearDesignBox}>
            <div
              style={{
                position: "absolute",
                top: postDesign.type === 'customed rubber case' ? "1%" : "0%",
              }}
              ref={topRef}
            ></div>
      
            <div>
              <button onClick={handleBack} className={styles.backb}>
                <i className="fas fa-arrow-left"></i>
              </button>
              <div className={postDesign.stock === 'customed rubber case' ? styles.selectedRubberDesignMain : styles.selectedClearDesignMain}>
                <div className={postDesign.stock === 'customed rubber case' ? styles.rubberr : styles.clear}>
                  <img
                    src={postDesign.image_url}
                    className={postDesign.type === 'customed rubber case' ? styles.rubber : styles.clear}
                    alt={`Post ${post.id}`}
                    style={{ paddingLeft: postDesign.type === 'customed rubber case' ? "0px" : "0%", height: "auto" }}
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
                                {comment.content}
                                 
                                  <button
                                    onClick={() => handleDeleteComment(post.id, comment.id)}
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
      
              <div className={postDesign.stock === 'In Stock' ? styles.rubberInfos : styles.clearInfos}>
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
                    <li>Maintains the phone’s sleek design while offering protection.</li>
                    <li>Edge-to-Edge Coverage: Covers all sides, corners, and back.</li>
                    <li>Raised Edges: Protects the screen and camera from direct contact with surfaces.</li>
                    <li>Dust and Water Resistance: Shields against minor spills and dust particles.</li>
                    <li><p className="mt-3">Model: {postDesign.modell[2] === 'o' ? postDesign.modell.slice(0, 2) + postDesign.modell.slice(3) : postDesign.modell}</p></li>
                    <li><p>Type: {postDesign.type}</p></li>
                    <li><p style={{ fontWeight: "bolder" }}>Price: {postDesign.price}$</p></li>
                  </ul>
                </div>
      
                <div className={styles.postText2}>
                  <p>{post.description}</p>
                </div>
      
                <p className={styles.timer} style={{ color: 'var(--thirdColor)' }}>Posted At: {new Date(post.created_at).toLocaleString()}</p>
      
                <div className={`${styles.holebuttonH}`}>
                  <div className={styles.postbuttonHolder}>
                    <button
                      className={`${styles.likebtn} ${post.is_liked ? styles.liked : ""}`}
                      onClick={() => handleLike(post.id)}
                    >
                      <i className={post.is_liked ? "fas fa-heart" : "far fa-heart"}></i>
                      <span>{post.is_liked ? "Liked" : "Like"}</span>
                      <h4>{post.like_count}</h4>
                    </button>
      
                    <button
                      className={`${styles.likebtn} ${post.is_favorite ? styles.liked : ""}`}
                      onClick={() => handleFavorite(post.id)}
                    >
                      <i className={post.is_favorite ? "fas fa-star" : "far fa-star"}></i>
                      <span>{post.is_favorite ? "Saved" : "Save"}</span>
                      <h4>{post.favorite_count}</h4>
                    </button>
      
                    <button
                      className={styles.btn5}
                      onClick={() => addToCart(postDesign.id)}
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
                    onClick={() => handleCommentSubmit(post.id)}
                    className={`${styles.addcommentbtn}`}
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            </div>
      
            {/* Same Type Section */}
            {sameClassSameTypePosts.length > 0 && (
              <section className={styles.viewsection}>
                <h2>Same Type</h2>
                <div className={styles.sliderContainer}>
                  <button className={styles.scrollButton} onClick={() => scrollSlider('left', 0)}>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <div className={styles.viewsectionD} ref={(el) => (slidersRef.current[0] = el)}>
                    {sameClassSameTypePosts.map((post) => (
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
                        <button className={styles.btn5} onClick={() => addToCart(post.design.id)}>
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
            {sameClassDifferentTypePosts.length > 0 && (
              <section className={styles.viewsection}>
                <h2>Other Types</h2>
                <div className={styles.sliderContainer}>
                  <button className={styles.scrollButton} onClick={() => scrollSlider('left', 1)}>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <div className={styles.viewsectionD} ref={(el) => (slidersRef.current[1] = el)}>
                    {sameClassDifferentTypePosts.map((post) => (
                      <div key={post.id} className={styles.cards}>
                        <div className={styles.imgBack} onClick={() => handlePostClick(post)}>
                          <img
                            src={post.design.image_url}
                            alt={`Post ${post.id}`}
                            className={post.design.stock === 'In Stock' ? styles.instockwidth : styles.outstockwidth}
                            style={{ borderRadius: '8px' }}
                          />
                        </div>
                        <div className={styles.cardsContent} onClick={() => handlePostClick(post)}>
                          <h2 className={styles.title}>{post.design.modell}</h2>
                          <p className={styles.disc}>{post.design.type}</p>
                          <p className={styles.disc}>By: {post.first_name}</p>
                          <p className={styles.title2}>Price: {post.design.price}$</p>
                        </div>
                        <button className={styles.btn5} onClick={() => addToCart(post.design.id)}>
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
          </div>
          </Layoutt>
        );
      }
  





      if(theSavedDesign){
        return(
          <div>
          <Layoutt>
            
          <div className={styles2.sevedcontainr}>
          <div
              style={{
                position: "absolute",
                top: theSavedDesign.type === 'customed rubber case' ? "-1%" : "0%",
              }}
              ref={topRef}
            ></div>
              <div className={styles2.savedimgdiv}>
              <img src={theSavedDesign.image_url} className={theSavedDesign.type === 'customed clear case'? styles2.clearimg : styles2.rubberimg} alt="" />
              </div>
      
              <div className={styles2.sevedinfos}>
      
              <h1>preview : </h1>
      
              <h2>price : {theSavedDesign.price}$</h2>
              <h3>Created By : {theSavedDesign.user}</h3>
              
              <h3>type : {theSavedDesign.type}</h3>
              <h3>model : {theSavedDesign.modell}</h3>
      
                  <h3>product id : {theSavedDesign.id}</h3>
                  
      
      
                  <h3 style={{color : theSavedDesign.stock === "Out of Stock"? "red" : 'var(--thirdColor)', fontWeight : "bolder",textTransform : "uppercase"}}>{theSavedDesign.stock}</h3>
                  <div className={styles2.savedbuttons}>
                  

          
     
          <button onClick={handDesignleBack} className={`${styles2.transparent} ${styles2.fab}`}><span>Leave It for Now</span></button>
          <button onClick={() => addToCart(theSavedDesign.id)}><span>Add to Chart</span></button>

          <button className={styles2.deletefinaldesign}  onClick={() =>{deleteDesign(theSavedDesign.id)}}>delete this </button>
          
          
          <Link  style={{width : "100%"}} href={`/makepost/${theSavedDesign.id}`}>
        <button style={{width : "100%"}}><span>Post It On Your Profile</span></button>
      </Link>
         <Link style={{width:'100%', display : theSavedDesign.stock === "Out of Stock"? "none" : 'block', fontWeight : "bolder"}} href={`/ordernow/${theSavedDesign.id}`}><button style={{width:'100%'}} className={styles2.order_now}><span>Order Now</span></button></Link>
       
      
                  </div>
      
                 
              </div>
              
          </div>
          </Layoutt>
          </div>
        )
      }


      
      if (showAllClearCases) {
        return (
          <Layoutt>
            <div className={styles3.viewsection}>
              <h2 className={styles3.h2title}  ref={scrollTargetRef}>Customed Clear Case Archive</h2>
      
              {/* Card Container */}

                {userDesigns && userDesigns.length > 0 ? (
                  (() => {
                    const filteredDesigns = userDesigns.filter(
                      (post) => post.type === 'customed clear case'
                    );
      
                    return (
                      <div className={styles3.viewsectionD}>
                        {filteredDesigns.map((post) => (
                          <div key={post.id} className={styles.cards}>
                            <div
                              className={styles.imgBack}
                              onClick={() => handleDesignClick(post)}
                            >
                              <img
                                src={post.image_url}
                                alt={`Post ${post.id}`}
                                className={
                                  post.type === 'customed rubber case'
                                    ? styles.instockwidth
                                    : styles.outstockwidth
                                }
                                style={{ borderRadius: '8px' }}
                              />
                            </div>
      
                            <div
                              className={styles.cardsContent}
                              onClick={() => handlePostClick(post)}
                            >
                              <h2 className={styles.title}>
                                {post.modell[2] === 'o'
                                  ? post.modell.slice(0, 2) + post.modell.slice(3)
                                  : post.modell}
                              </h2>
                              <p className={styles.disc}>{post.type}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()
                ) : (
                  <p>No customed clear cases available</p>
                )}

      
              <div className={styles1.showLessWrapper}>
                <button
                  className={styles1.showLessButton}
                  onClick={() => setShowAllClearCases(false)}
                >
                  Show Less
                </button>
              </div>
            </div>
          </Layoutt>
        );
      }
      
      if (showAllRubberCases) {
        return (
          <Layoutt>
            <div className={styles3.viewsection}>
              <h2 className={styles3.h2title} ref={scrollTargetRef}>Customed Rubber Case Archive</h2>
      
              {/* Card Container */}

                {userDesigns && userDesigns.length > 0 ? (
                  (() => {
                    const filteredDesigns = userDesigns.filter(
                      (post) => post.type === 'customed rubber case'
                    );
      
                    return (
                      <div className={styles3.viewsectionD}>
                        {filteredDesigns.map((post) => (
                          <div key={post.id} className={styles.cards}>
                            <div
                              className={styles.imgBack}
                              onClick={() => handleDesignClick(post)}
                            >
                              <img
                                src={post.image_url}
                                alt={`Post ${post.id}`}
                                className={
                                  post.type === 'customed rubber case'
                                    ? styles.instockwidth
                                    : styles.outstockwidth
                                }
                                style={{ borderRadius: '8px' }}
                              />
                            </div>
      
                            <div
                              className={styles.cardsContent}
                              onClick={() => handlePostClick(post)}
                            >
                              <h2 className={styles.title}>
                                {post.modell[2] === 'o'
                                  ? post.modell.slice(0, 2) + post.modell.slice(3)
                                  : post.modell}
                              </h2>
                              <p className={styles.disc}>{post.type}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()
                ) : (
                  <p>No customed rubber cases available</p>
                )}

      
              <div className={styles1.showLessWrapper}>
                <button
                  className={styles1.showLessButton}
                  onClick={() => setShowAllRubberCases(false)}
                >
                  Show Less
                </button>
              </div>
            </div>
          </Layoutt>
        );
      }
      



    return (
<Layoutt>
    <div className={styles1.profile_container}>
      <div className={styles1.profile_header}>
        <img src={profilePicUrl} alt="Profile" className={styles1.profile_pic} />
        <h1 className={styles1.profile_title}>@{userData.username}</h1>
      </div>

      <div className={styles1.profile_info}>
        {isEditing ?  (
  <>

    <div className={styles1.profile_info_item}>
      <span className={styles1.profile_label}>First Name:</span>
      <input
        type="text"
        name="first_name"
        value={editData.first_name}
        onChange={handleChange}
        
      />
    </div>
    <div className={styles1.profile_info_item}>
      <span className={styles1.profile_label}>Last Name:</span>
      <input
        type="text"
        name="last_name"
        value={editData.last_name}
        onChange={handleChange}
        
      />
    </div>

<div className={styles1.profile_info_item}>
  <span className={styles1.profile_label}>Username:</span>
  <input
    type="text"
    name="username"
    value={userData.username}
    readOnly
    className={styles1.disabled_input}
    style={{ opacity: 0.5, cursor: "not-allowed" }}
  />
</div>
    <div className={styles1.profile_info_item}>
      <span className={styles1.profile_label}>Email:</span>
      <input
        type="email"
        name="email"
        value={editData.email}
        onChange={handleChange}
        
      />
    </div>
    <div className={styles1.confirmationdiv}>
      <button onClick={handleSave} className={styles1.edit_button}>
        Save
      </button>
      <button onClick={() => setIsEditing(false)} className={styles1.cancel_button}>
        Cancel
      </button>
    </div>
  </>
)  : (
          <>
            <div className={styles1.profile_info_item}>
              <span className={styles1.profile_label}>First Name:</span>
              <span className={styles1.profile_value}>{userData.first_name}</span>
            </div>
            <div className={styles1.profile_info_item}>
              <span className={styles1.profile_label}>Last Name:</span>
              <span className={styles1.profile_value}>{userData.last_name}</span>
            </div>
            <div className={styles1.profile_info_item}>
              <span className={styles1.profile_label}>Username:</span>
              <span className={styles1.profile_value}>@{userData.username}</span>
            </div>
            <div className={styles1.profile_info_item}>
              <span className={styles1.profile_label}>Email:</span>
              <span className={styles1.profile_value}>{userData.email}</span>
            </div>
          </>
        )}
      </div>

{!isEditing && userData.username !== "admin" && (
  <div className={styles1.container_of_editbtn}>
    <button
      onClick={() => {
        setEditData({
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
        });
        setIsEditing(true);
      }}
      className={styles1.edit_button}
    >
      Edit Info
    </button>
  </div>
)}


      {userData.username === "admin" && (
        <div className={styles1.container_of_editbtn}>
          <button onClick={handleGoToAdminPage} className={styles1.edit_button}>
            Admin Dashboard
          </button>
        </div>
      )}
    </div>







<section className={styles.viewsection}>
  <h2>Customed Clear Case Archive</h2>
  <div className={styles.sliderContainer}>
    {/* Filter customed clear cases */}
    {userDesigns &&
      userDesigns.filter(post => post.type === 'customed clear case').length > 0 && (
        <>
          {/* Left Scroll Button */}
          <button
            className={styles.scrollButton}
            onClick={() => scrollSlider('left', 0)}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        </>
      )}

    {/* Card Container */}
    <div className={styles.viewsectionD} ref={(el) => (slidersRef.current[0] = el)}>
      {userDesigns && userDesigns.length > 0 ? (
        (() => {
          // Filter for customed clear cases
          const filteredDesigns = userDesigns.filter(
            (post) => post.type === 'customed clear case'
          );
          const totalDesigns = filteredDesigns.length;
          const displayDesigns = totalDesigns > 6 ? filteredDesigns.slice(0, 6) : filteredDesigns;

          return (
            <>
              {/* Render first 5 (or less) cards */}
              {displayDesigns.map((post) => (
                <div key={post.id} className={`${styles.cards}`}>
                  <div
                    className={styles.imgBack}
                    onClick={() => handleDesignClick(post)}
                  >
                    <img
                      src={post.image_url}
                      alt={`Post ${post.id}`}
                      className={
                        post.type === 'customed rubber case' ? styles.instockwidth : styles.outstockwidth
                      }
                      style={{ borderRadius: '8px' }}
                    />
                  </div>

                  <div
                    className={styles.cardsContent}
                    onClick={() => handlePostClick(post)}
                  >
                    <h2 className={`${styles.title}`}>
                      {post.modell[2] === 'o'
                        ? post.modell.slice(0, 2) + post.modell.slice(3)
                        : post.modell}
                    </h2>
                    <p className={`${styles.disc}`}>{post.type}</p>
                  </div>
                </div>
              ))}

              {/* Show More Card */}
              {totalDesigns > 6 && (
  <div className={`${styles.cards}`} onClick={() => handleShowMore()}>
    
      <div className={styles1.showMoreContent}>
        <img
          src="/TheStyle/phone.png"
          alt="Show More Phone"
          className={styles1.showMoreImage}
        />
        <p className={styles1.showMoreText}>SHOW MORE</p>
      </div>
   

  </div>
)}
            </>
          );
        })()
      ) : (
        <p>No customed clear cases available</p>
      )}
    </div>

    {/* Right Scroll Button */}
    {userDesigns &&
      userDesigns.filter(post => post.type === 'customed clear case').length > 0 && (
        <>
          <button
            className={styles.scrollButton}
            onClick={() => scrollSlider('right', 0)}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </>
      )}
  </div>
</section>


<section className={styles.viewsection}>
  <h2>Customed Rubber Case Archive</h2>
  <div className={styles.sliderContainer}>
    {/* Filter customed rubber cases */}
    {userDesigns &&
      userDesigns.filter(post => post.type === 'customed rubber case').length > 0 && (
        <>
          {/* Left Scroll Button */}
          <button
            className={styles.scrollButton}
            onClick={() => scrollSlider('left', 1)}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        </>
      )}

    {/* Card Container */}
    <div className={styles.viewsectionD} ref={(el) => (slidersRef.current[1] = el)}>
      {userDesigns && userDesigns.length > 0 ? (
        (() => {
          const filteredDesigns = userDesigns.filter(
            post => post.type === 'customed rubber case'
          );
          const totalDesigns = filteredDesigns.length;
          const displayDesigns = totalDesigns > 8 ? filteredDesigns.slice(0, 8) : filteredDesigns;

          return (
            <>
              {displayDesigns.map((post) => (
                <div key={post.id} className={`${styles.cards}`}>
                  <div
                    className={styles.imgBack}
                    onClick={() => handleDesignClick(post)}
                  >
                    <img
                      src={post.image_url}
                      alt={`Post ${post.id}`}
                      className={
                        post.type === 'customed rubber case' ? styles.instockwidth : styles.outstockwidth
                      }
                      style={{ borderRadius: '8px' }}
                    />
                  </div>

                  <div
                    className={styles.cardsContent}
                    onClick={() => handlePostClick(post)}
                  >
                    <h2 className={`${styles.title}`}>
                      {post.modell[2] === 'o'
                        ? post.modell.slice(0, 2) + post.modell.slice(3)
                        : post.modell}
                    </h2>
                    <p className={`${styles.disc}`}>{post.type}</p>
                  </div>
                </div>
              ))}

              {/* Show More Card */}
              {totalDesigns > 6 && (
  <div className={`${styles.cards}`} onClick={() => handleShowMore2()}>
    
      <div className={styles1.showMoreContent}>
        <img
          src="/TheStyle/phone.png"
          alt="Show More Phone"
          className={styles1.showMoreImage}
        />
        <p className={styles1.showMoreText}>SHOW MORE</p>
      </div>
   

  </div>
)}
            </>
          );
        })()
      ) : (
        <p>No customed rubber cases available</p>
      )}
    </div>

    {/* Right Scroll Button */}
    {userDesigns &&
      userDesigns.filter(post => post.type === 'customed rubber case').length > 0 && (
        <>
          <button
            className={styles.scrollButton}
            onClick={() => scrollSlider('right', 1)}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </>
      )}
  </div>
</section>



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
            <button className={styles1.deleteButton} onClick={()=>{deletePost(post.id)}}>delete post</button>
          </div>

          {/* Add to Cart Button */}

        </div>
      </div>
    ))
  ) : (
    <p>No posts available</p>
  )}
</div>



    </Layoutt>

    );
}

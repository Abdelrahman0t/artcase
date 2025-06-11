'use client';

import React, { useEffect, useState,useRef  } from "react";
import { color, div, select } from "three/webgpu";
import Layout from '../../ordernow/layout' ;
import styles from '../../fyp/fyp.module.css';
import { useRouter } from 'next/navigation';
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
  interface PostProps {
    params: {
      postid: string;
    };
  }


  interface PostDetails {
    id: number;
    caption: string;
    description: string;
    user: string;
    user_id: number;
    created_at: string;
    like_count: number;
    comment_count: number;
    favorite_count: number;
    first_name: string;
    profile_pic: string;
    design: {
      id: number;
      image_url: string;
      stock: string;
      modell: string;
      type: string;
      sku: string;
      price: string;
      theclass: string;
    };
  }

  const PostDetailsPage: React.FC<PostProps> = ({ params }) => {
    const [post, setPost] = useState<PostDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

     const [posts, setPosts] = useState<any[]>([]);

      const [selectedPost, setSelectedPost] = useState<any | null>(null); // Track the selected post
      const [commentContent, setCommentContent] = useState<string>("");
      const [isFavorite, setIsFavorite] = useState(false);
    
      const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
      const [mostLiked, setMostLiked] = useState(false);
      const [mostAddedToCart, setMostAddedToCart] = useState(false);
      const [commentsVisible, setCommentsVisible] = useState(false);
    
      const isFirstRender = useRef(true);
    
      const slidersRef = useRef([]); // Array of refs to store each slider's ref
      const topRef = useRef<HTMLDivElement | null>(null);
    
    const [historyStack, setHistoryStack] = useState([]);
    const router = useRouter();
    const [reportReason, setReportReason] = useState('');
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportingType, setReportingType] = useState<'post' | 'comment' | null>(null);
    const [reportingId, setReportingId] = useState<number | null>(null);

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
      if (post) {
        const likeState = localStorage.getItem(`like_${post.id}`);
        const favoriteState = localStorage.getItem(`favorite_${post.id}`);
        const updatedPost = { ...post };
    
        if (likeState) {
          updatedPost.is_liked = JSON.parse(likeState);
        }
        if (favoriteState) {
          updatedPost.is_favorite = JSON.parse(favoriteState);
        }
    
        // Only update state if there are changes
        if (
          updatedPost.is_liked !== post.is_liked ||
          updatedPost.is_favorite !== post.is_favorite
        ) {
          setPost(updatedPost);
        }
      }
    }, [post]);

  
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
        setPost((prevPost) => ({
          ...prevPost,
          comments: data.comments || [], // Assuming response contains an array of comments
        }));
      } catch (error) {
        console.log("Error fetching comments:", error);
      }
    };

    function handDesignleBack(){
      setTheSavedDesign(null)
    }
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
      const fetchPostDetails = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${params.postid}/`);
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const data: PostDetails = await response.json();
          setPost(data);
          console.log(data)
          fetchComments(data.id)
        } catch (err: any) {
          setError(err.message || "An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchPostDetails();
    }, [params.postid]);
  
    if (loading) {
      return <Layout><p>Loading...</p></Layout>;
    }
  
    if (error) {
      return <Layout><p>Error: {error}</p></Layout>;
    }
  
    if (!post) {
      return <Layout><p>Post not found.</p></Layout>;
    }



    


    const handleBack = () => {


          router.push('/fyp'); // Navigate to the homepage

    };
    

      
      const handleLike = async (postId: number) => {
        const token = localStorage.getItem('token')
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
          setPost((prevPost) => ({
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
          setPost((prevPost) => ({
            ...prevPost,
            favorite_count: data.message === "Favorite added." ? prevPost.favorite_count + 1 : prevPost.favorite_count - 1,
            is_favorite: newFavoriteState,
          }));
        } else {
          console.error("Error toggling favorite:", data);
        }
      };
      
      // Fetch comments for the selected post

    
      const handleCommentSubmit = async (postId: number) => {
        const token = localStorage.getItem('token')
        if (!token) {
          alert('You must be logged');
          window.location.href = '/login'; // or '/auth/login' if that's your route
          return;
        }
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
          setPost((prevPost) =>
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
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/${commentId}/delete/`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          });
      
          if (response.ok) {
            // Update the post state to remove the deleted comment
            setPost((prevPost) => {
              if (prevPost && prevPost.comments) {
                return {
                  ...prevPost,
                  comments: prevPost.comments.filter((comment) => comment.id !== commentId),
                };
              }
              return prevPost;
            });
      
            console.log(`Comment ${commentId} deleted successfully.`);
          } else {
            const errorData = await response.json();
            console.error("Error deleting comment:", errorData);
          }
        } catch (error) {
          console.error("Error in handleDeleteComment:", error);
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
  


      

    return (
      <Layout>


        

          {/*==============================================================================================================================================================================================*/}
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
  };
  
  export default PostDetailsPage;
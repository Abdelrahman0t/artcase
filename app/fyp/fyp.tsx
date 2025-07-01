'use client';

import React, { useEffect, useState, useRef } from "react";
import { color, div, select } from "three/webgpu";
import Layout from './layout';
import styles from './fyp.module.css';
import styles1 from '../profile/profile.module.css';
import styles3 from '../BuyingChart/chart.module.css'

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'
import {
  Post,
  Comment,
  fetchPublicPosts,
  fetchMostLikedDesigns,
  fetchMostAddedToCartDesigns,
  handleLike,
  handleFavorite,
  fetchComments,
  handleCommentSubmit,
  handleDeleteComment,
  addToCart,
  decodeJwt,
  getAuthToken
} from '../utils/apiUtils';

export default function PublicFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentContent, setCommentContent] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState(false);

  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const [mostLiked, setMostLiked] = useState<Post[]>([]);
  const [mostAddedToCart, setMostAddedToCart] = useState<Post[]>([]);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [showAllTrendingCases, setShowAllTrendingCases] = useState(false);

  const isFirstRender = useRef(true);

  const slidersRef = useRef<(HTMLDivElement | null)[]>([]);
  const topRef = useRef<HTMLDivElement | null>(null);
  const scrollTargetRef = useRef<HTMLDivElement | null>(null);

  const [historyStack, setHistoryStack] = useState<Post[]>([]);

  const router = useRouter()
  
  const [reportReason, setReportReason] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingType, setReportingType] = useState<'post' | 'comment' | null>(null);
  const [reportingId, setReportingId] = useState<number | null>(null);

  const scrollSlider = (direction: 'left' | 'right', index: number) => {
    const slider = slidersRef.current[index];
    if (slider) {
      const scrollAmount = slider.clientWidth;
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
    const handleShowMoreTrending = () => {
      setShowAllTrendingCases(true);
      setTimeout(() => {
        scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };
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
  useEffect(() => {
    if (isFirstRender.current && selectedPost) {
      isFirstRender.current = false; // After the first render, set it to false
    }
  }, [selectedPost])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [likedDesigns, cartDesigns] = await Promise.all([
          fetchMostLikedDesigns(),
          fetchMostAddedToCartDesigns()
        ]);
        setMostLiked(likedDesigns);
        setMostAddedToCart(cartDesigns);
      } catch (error) {
        console.error("Failed to fetch designs:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      try {
        const decodedToken = decodeJwt(token);
        if (decodedToken) {
          setLoggedInUsername(decodedToken.user_id.toString());
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await fetchPublicPosts();
        setPosts(data);
      } catch (err) {
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
    if (historyStack.length > 0) {
      const previousPost = historyStack[historyStack.length - 1];
      setHistoryStack(prev => prev.slice(0, -1));
      setSelectedPost(previousPost);
    } else {
      setSelectedPost(null);
    }
    isFirstRender.current = true;
  };

  const handleLikeClick = async (postId: number) => {
    try {
      const result = await handleLike(postId);
      const newLikeState = result.message === "Like added.";
      localStorage.setItem(`like_${postId}`, JSON.stringify(newLikeState));
      setSelectedPost(prev => {
        if (!prev) return null;
        return {
          ...prev,
          like_count: result.message === "Like added." ? prev.like_count + 1 : prev.like_count - 1,
          is_liked: newLikeState,
        };
      });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleFavoriteClick = async (postId: number) => {
    try {
      const result = await handleFavorite(postId);
      const newFavoriteState = result.message === "Favorite added.";
      localStorage.setItem(`favorite_${postId}`, JSON.stringify(newFavoriteState));
      setSelectedPost(prev => {
        if (!prev) return null;
        return {
          ...prev,
          favorite_count: result.message === "Favorite added." ? prev.favorite_count + 1 : prev.favorite_count - 1,
          is_favorite: newFavoriteState,
        };
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
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

  const handleDeleteCommentClick = async (postId: number, commentId: number) => {
    try {
      await handleDeleteComment(commentId);
      setSelectedPost(prev => {
        if (!prev) return null;
        return {
          ...prev,
          comments: prev.comments?.filter(comment => comment.id !== commentId) || [],
        };
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
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

  const filteredPosts = {
    anime: posts.filter(post => post.design && post.design.theclass === 'anime'),
    nature: posts.filter(post => post.design && post.design.theclass === 'nature'),
    sports: posts.filter(post => post.design && post.design.theclass === 'sports'),
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
  );
}
  
if (showAllTrendingCases) {
  return (
    <div className={styles3.viewsection}>
      <h2 className={styles3.h2title} ref={scrollTargetRef}>Trending</h2>

      {/* Card Container */}
      {mostAddedToCart && mostAddedToCart.length > 0 ? (
        <div className={styles3.viewsectionD}>
          {mostAddedToCart.map((post) => (
            <div key={post.id} className={styles.cards}>
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
                  style={{ borderRadius: '8px' }}
                />
              </div>

              <div
                className={styles.cardsContent}
                onClick={() => handlePostClick(post)}
              >
                <h2 className={styles.title}>
                  {post.design.modell[2] === 'o'
                    ? post.design.modell.slice(0, 2) + post.design.modell.slice(3)
                    : post.design.modell}
                </h2>
                <p className={styles.disc}>{post.design.type}</p>
                
                <p className={styles.disc}>
                  By:
                  <img
                    src={post.profile_pic}
                    className={styles.discprofile_pic}
                    alt=""
                  />
                  {post.first_name}
                </p>
                <p className={styles.title2}>Price: {post.design.price}$</p>
              </div>
              <button className={styles.btn5} onClick={() => handleAddToCart(post.design.id)}>
                Add to cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No trending cases available</p>
      )}

      <div className={styles1.showLessWrapper}>
        <button
          className={styles1.showLessButton}
          onClick={() => setShowAllTrendingCases(false)}
        >
          Show Less
        </button>
      </div>
    </div>
  );
}

return (

  <div>
    {loading ? (
      <p>Loading posts...</p>
    ) : error ? (
      <p style={{ color: "red" }}>{error}</p>
    ) : posts.length === 0 ? (
      <p>No posts found.</p>
    ) : (
      <>

      
           
           <div className={`${styles.intro}`}>
            <div style={{display : "flex",width : "100%", justifyContent: 'space-between'}}>

<div className={styles.textContent}>
    <h1 className="mb-sm-3 mb-md-3 mb-lg-3" style={{fontWeight : 'bolder'}} >
      WELCOME TO THE <span style={{color : 'rgba(8, 40, 74, 0.82)'}}> ARTCASE </span>
    </h1>
    <h3 className="mb-sm-2 mb-md-3 mb-lg-3" >
      Create your own phone case with your desired design and make your phone your own art.
    </h3>
    <p >
      Browse through our extensive gallery for inspiration or upload your own artwork to make something truly unique.
    </p>
    <button className={styles.Mainbtn5} style={{boxShadow : 'none' }}>Get Started</button>
    <button className={styles.btn5} style={{boxShadow : 'none', color : 'white',backgroundColor : 'transparent'}}>Create Your Case</button>

    </div>
    <div className={`${styles.introimgH}  col-3 d-flex align-items-start`} style={{height : '200px'}}>
  
<div>
  {/**/}
<img
src="TheStyle/il_794xN.4400126021_12lp.avif"

className={styles.float_animation}
alt="Stitch"
/>
</div>

</div>


    </div>
    </div>
       
        {/*
    <div className={`${styles.introsec}`}>
  <div>
    <div className={`${styles.img_cont} ${styles.img1}`}>
      <img src="TheStyle/7893a83632194e9530ec3d72e12336e3.jpg" alt="Image 1" />
      <div className={styles.ovv}>

        <p className={styles.disc}>Content for Image 1</p>
        </div>
    </div>
    <div className={`${styles.img_cont} ${styles.img4}`}>
      <img src="TheStyle/il_600x600.6236061797_7dog.webp" alt="Image 4" />
      <div className={styles.ovv}>Content for Image 4</div>
    </div>
  </div>

  <div>
    <div className={`${styles.img_cont} ${styles.img2}`}>
      <img src="TheStyle/0bf2065cb1b3747995901934e6d7c77b.jpg" alt="Image 3" />
      <div className={styles.ovv}>Content for Image 2</div>
    </div>
    <div className={`${styles.img_cont} ${styles.img5}`}>
      <img  src="TheStyle/dbc26eaa5c830640521baa7596451a8f.jpg" alt="Image 4" />
      <div className={styles.ovv}>Content for Image 5</div>
    </div>
  </div>

  <div>
    <div className={`${styles.img_cont} ${styles.img3}`}>
      <img src="TheStyle/a607b5ad6cc6b5b14866c4bba1492060.jpg" alt="Image 5" />
      <div className={styles.ovv}>Content for Image 3</div>
    </div>
    <div className={`${styles.img_cont} ${styles.img6}`}>
      <img  src="TheStyle/31165ea28bba5067c12e141eb410c63b.jpg" alt="Image 6" />
      <div className={styles.ovv}>Content for Image 6</div>
    </div>
  </div>
</div>


       

        {/* Anime Section */}

  <div
className={styles.cards_container}
  >
    {/* Card 1 */}
    <div
className={styles.card}
    >
      <img
        src="/TheStyle/innovation.png"
        alt="Customization Icon"
        
      />
      <h3 >Unlimited Customization</h3>
      <p >
        Create your own designs with endless possibilities. Your case, your style.
      </p>
    </div>

    {/* Card 2 */}
    <div
className={styles.card}
    >
      <img
        src="/TheStyle/material.png"
        alt="Durability Icon"
       
      />
      <h3 >Durable Materials</h3>
      <p >
        Built to last with high-quality materials, ensuring your phone is always protected.
      </p>
    </div>

    {/* Card 3 */}
    <div
className={styles.card}
    >
      <img
        src="/TheStyle/ecosystem.png"
        alt="Eco-friendly Icon"
        
      />
      <h3 >Eco-Friendly</h3>
      <p >
        Our cases are made from sustainable materials to protect your phone and the planet.
      </p>
    </div>

    <div
    className={styles.card}
  >
    <img
      src="/TheStyle/phone.png"
      alt="Premium Design Icon"
      
    />
    <h3 >Premium Design</h3>
    <p >
      Enjoy sleek and modern designs that perfectly complement your phone. Our cases are stylish and functional.
    </p>
  </div>

  {/* Card 5 */}
  <div
    className={styles.card}
  >
    <img
      src="/TheStyle/fast-delivery.png"
      alt="Fast Shipping Icon"

    />
    <h3 >Fast Shipping</h3>
    <p >
      Get your custom case delivered quickly and efficiently. We ship worldwide to ensure everyone can enjoy our products.
    </p>
  </div>

  {/* Card 6 */}
  <div
    className={styles.card}
  >
    <img
      src="/TheStyle/support.png"
      alt="Customer Support Icon"
  
    />
    <h3 >Excellent Support</h3>
    <p >
      Our dedicated support team is always here to help with your questions or concerns, ensuring a smooth experience.
    </p>
  </div>
  </div>
        {mostAddedToCart.length > 0 ? (
<section className={styles.viewsection}>
  <h2>Trending</h2>
  <div className={styles.sliderContainer}>
    {/* Scroll Button - Left */}
    {mostAddedToCart && mostAddedToCart.length > 0 && (
      <button
        className={styles.scrollButton}
        onClick={() => scrollSlider('left', 2)}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
    )}

    {/* Card Container */}
    <div
      className={styles.viewsectionD}
      ref={(el) => (slidersRef.current[2] = el)}
    >
      {mostAddedToCart && mostAddedToCart.length > 0 ? (
        (() => {
          const totalPosts = mostAddedToCart.length;
          const displayPosts =
            totalPosts > 5 ? mostAddedToCart.slice(0, 5) : mostAddedToCart;

          return (
            <>
              {displayPosts.map((post) => (
                <div key={post.id} className={styles.cards}>
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
                      style={{ borderRadius: '8px' }}
                    />
                  </div>

                  <div
                    className={styles.cardsContent}
                    onClick={() => handlePostClick(post)}
                  >
                    <h2 className={styles.title}>
                      {post.design.modell[2] === 'o'
                        ? post.design.modell.slice(0, 2) +
                          post.design.modell.slice(3)
                        : post.design.modell}
                    </h2>
                    <p className={styles.disc}>{post.design.type}</p>
                    <p className={styles.disc}>
                      By:{' '}
                      <img
                        src={post.profile_pic}
                        className={styles.discprofile_pic}
                        alt=""
                      />{' '}
                      {post.first_name}
                    </p>
                    <p className={styles.title2}>
                      Price: {post.design.price}$
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

              {/* Show More Card */}
              {totalPosts > 5 && (
                <div
                  className={`${styles.cards}`}
                  onClick={() => handleShowMoreTrending()}
                >
                  <div className={styles1.showMoreContent}>
                    <img
                      src="/TheStyle/phone.png"
                      alt="Show More"
                      className={styles1.showMoreImage}
                    />
                    <p className={styles1.showMoreText}>SHOW ALL</p>
                  </div>
                </div>
              )}
            </>
          );
        })()
      ) : (
        <p>No trending items available</p>
      )}
    </div>

    {/* Scroll Button - Right */}
    {mostAddedToCart && mostAddedToCart.length > 0 && (
      <button
        className={styles.scrollButton}
        onClick={() => scrollSlider('right', 2)}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    )}
  </div>
</section>

) : (
  <section className={styles.viewsection}>
    <h2>No items added to cart yet</h2>
  </section>
)}

        {/* Nature Section */}


        {/*discover*/}


        <div >


  {/* Cards Container */}


</div>




      </>
    )}



{mostLiked.length > 0 && (
  <section className={styles.viewsection}>
  <h2>Most Liked</h2>
  <div className={styles.sliderContainer}>
    {/* Left Scroll Button */}
    <button
      className={` ${styles.scrollButton}`}
      onClick={() => scrollSlider('left',4)}
    >
      <i className="fas fa-chevron-left"></i> {/* Left arrow */}
    </button>

    {/* Card Container */}
    <div className={styles.viewsectionD} ref={(el) => (slidersRef.current[4] = el)}>
      {mostLiked.map((post) => (
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
      onClick={() => scrollSlider('right',4)}
    >
       <i className="fas fa-chevron-right"></i> {/* Right arrow */}
    </button>
  </div>
</section>
)}






  </div>
);

}

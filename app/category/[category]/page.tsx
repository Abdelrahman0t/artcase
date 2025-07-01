// app/category/[category]/page.tsx
'use client';
import styles from '../../newexplore/newexplore.module.css';
import styles1 from '../../newui/newui.module.css';
import Link from 'next/link';
import Layout from '../../newui/layout';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiBookmark, FiEye, FiShoppingCart, FiArrowRight, FiPenTool } from 'react-icons/fi';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaComment, FaShoppingCart, FaMobile, FaTag, FaTrash, FaCalendarAlt, FaDollarSign, FaUpload, FaMobileAlt, FaEye, FaLock, FaShare, FaPlane, FaUndo, FaMapMarkerAlt, FaEnvelope, FaInstagram, FaTiktok, FaPinterest } from 'react-icons/fa';
import {
  fetchPublicPosts,
  handleLike,
  handleFavorite,
  handleCommentSubmit,
  handleDeleteComment,
  addToCart,
  fetchComments,
  Post as ApiPost,
  Comment,
} from '../../utils/apiUtils';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

const decodeJwt = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  return JSON.parse(jsonPayload);
  };

interface Design {
  theclass: string;
  image_url: string;
  modell: string;
  price: string;
  sku: string;
  stock: string;
  type: string;
}

interface Post extends ApiPost {
  hashtag_names?: string[];
  comment_count?: number;
  user_details?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_pic: string;
    status: string;
    is_staff: boolean;
    date_joined: string;
    last_login: string;
  };
  user?: {
    id: number;
    username: string;
    profile_pic: string;
  };
}

interface ExtendedComment extends Comment {
  username: string;
}

const CategoryPage = () => {
  const params = useParams();
  const category = params.category as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const visiblePosts = 12;
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setCurrentUserId(data.id))
        .catch(() => setCurrentUserId(null));
    }
  }, []);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public-posts/?as_user=${token ? JSON.parse(atob(token.split('.')[1])).user_id : ''}`, {
          headers,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        
        // Decode the category name from URL
        const decodedCategory = decodeURIComponent(category);
        
        // Filter by hashtags (case-insensitive, partial match)
        const filteredPosts = data.filter((post: Post) => {
          if (!post.hashtag_names || post.hashtag_names.length === 0) return false;
          const searchCategory = decodedCategory.toLowerCase();
          return post.hashtag_names.some((tag: string) =>
            tag.toLowerCase() === searchCategory ||
            tag.toLowerCase().includes(searchCategory) ||
            searchCategory.includes(tag.toLowerCase())
          );
        });
        
        console.log('Category:', decodedCategory);
        console.log('Total posts:', data.length);
        console.log('Filtered posts:', filteredPosts.length);
        console.log('Available categories:', [...new Set(data.map((post: Post) => post.design.theclass))]);
        
        setPosts(filteredPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  const handlePostClick = async (post: Post) => {
    setSelectedPost(post);
    setIsLiked(post.is_liked);
    setIsSaved(post.is_favorited);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleLike = async (postId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to like posts');
      return;
    }

    try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/like/`, {
        method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
    });
  
      if (response.ok) {
        const data = await response.json();

        // Update posts list
        setPosts(prev =>
          prev.map(post =>
            post.id === postId
              ? {
                  ...post,
                  like_count: data.like_count,
                  is_liked: data.is_liked,
                }
              : post
          )
        );

        // Update selected post if it's the one being liked
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(prev =>
            prev
              ? {
                  ...prev,
                  like_count: data.like_count,
                  is_liked: data.is_liked,
                }
              : null
          );
          setIsLiked(data.is_liked);
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to like post:', errorData);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  
  const handleFavorite = async (postId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to favorite posts');
      return;
    }

    try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/favorite/`, {
        method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
    });
  
      if (response.ok) {
        const data = await response.json();

        // Update posts list
        setPosts(prev =>
          prev.map(post =>
            post.id === postId
              ? {
                  ...post,
                  favorite_count: data.favorite_count,
                  is_favorited: data.is_favorited,
                }
              : post
          )
        );

        // Update selected post if it's the one being favorited
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(prev =>
            prev
              ? {
                  ...prev,
                  favorite_count: data.favorite_count,
                  is_favorited: data.is_favorited,
                }
              : null
          );
          setIsSaved(data.is_favorited);
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to favorite post:', errorData);
      }
    } catch (error) {
      console.error('Error favoriting post:', error);
    }
  };

  const handleComment = async (e: React.FormEvent<HTMLFormElement>, postId: number) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to comment');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const content = formData.get('content') as string;

    if (!content.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/comment/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add the new comment to the post
        const newComment = {
          id: data.comment.id,
          content: content,
          created_at: new Date().toISOString(),
          user_id: data.comment.user_id,
          username: data.comment.username,
          profile_pic: data.comment.profile_pic,
          first_name: data.comment.first_name,
        };

        // Update posts with new comment
        setPosts(prevPosts => 
          prevPosts.map(post => 
post.id === postId
              ? { 
                  ...post, 
                  comment_count: post.comment_count + 1,
                  comments: [...(post.comments || []), newComment]
                }
  : post
          )
        );
        
        // Update selected post if it's the one being commented on
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(prev => prev ? { 
            ...prev, 
            comment_count: prev.comment_count + 1,
            comments: [...(prev.comments || []), newComment]
          } : null);
        }

        // Clear the comment input
        e.currentTarget.reset();
      } else {
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: number, postId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to delete comments');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/${commentId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove the comment from the posts list
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  comment_count: post.comment_count - 1,
                  comments: post.comments.filter(comment => comment.id !== commentId)
                }
              : post
          )
        );
        
        // Remove the comment from the selected post
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(prev => prev ? { 
            ...prev, 
            comment_count: prev.comment_count - 1,
            comments: prev.comments.filter(comment => comment.id !== commentId)
          } : null);
        }
      } else {
        console.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: product.design.id,
      name: product.caption,
      image: product.design.image_url,
      price: product.design.price,
      type: product.design.type,
      modell: product.design.modell,
      quantity: 1,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const index = existingCart.findIndex((item: any) => item.id === cartItem.id);

    if (index > -1) {
      existingCart[index].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert('Added to cart successfully!');
  };

  const handleShowMore = () => {
    setShowAllPosts((prev) => !prev);
  };

  if (loading) return (
    <Layout>
      <div style={{textAlign: 'center', width: '100%', color: '#888', fontSize: 18, padding: '2rem 0'}}>
        Loading designs...
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div style={{textAlign: 'center', width: '100%', color: '#ff6b6b', fontSize: 18, padding: '2rem 0'}}>
        Error: {error}
      </div>
    </Layout>
  );
  
    return (
      <Layout>
      {/* Category Header Section */}
      <section className={styles.browseSection}>
        <div className={styles.browsecontainer}>
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className={styles.sectionTitle}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className={styles1.highlight2}>{decodeURIComponent(category)}</span> Designs
            </motion.h1>
            <motion.p 
              className={styles.sectionSubtitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Discover amazing {decodeURIComponent(category).toLowerCase()} phone case designs created by talented artists
            </motion.p>
          </motion.div>

          {/* Designs Grid */}
          <motion.div 
            className={styles.designsGrid}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {posts.length === 0 ? (
              <div style={{textAlign: 'center', width: '100%', color: '#888', fontSize: 18, padding: '2rem 0'}}>
                No designs available in this category.
              </div>
            ) : (
              posts.slice(0, showAllPosts ? posts.length : visiblePosts).map((post, index) => (
                <motion.div 
                  key={post.id}
                  className={styles.cards}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 300, 
                    damping: 25,
                    delay: index * 0.1,
                    duration: 0.6
                  }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div 
                    className={styles.imgBack}
                    transition={{ duration: 0.3 }}
                  >
            <img
              src={post.design.image_url}
                      alt={post.caption} 
                      className={post.design.type === 'customed clear case' ? styles.clearW : styles.rubberW}
                    />
                    <div className={styles.imageIconButtons}>
                      <motion.button 
                        className={`${post.is_liked ? styles1.liked : ''} ${styles.likeButton}`} 
                        whileTap={{ scale: 0.9 }} 
                        onClick={() => handleLike(post.id)}
                      >
                        {post.is_liked ? <FaHeart /> : <FiHeart />}
                      </motion.button>
                      <motion.button 
                        className={`${post.is_favorited ? styles1.favorited : ''} ${styles.saveButton}`} 
                        whileTap={{ scale: 0.9 }} 
                        onClick={() => handleFavorite(post.id)}
                      >
                        {post.is_favorited ? <FaBookmark /> : <FiBookmark />}
                      </motion.button>
          </div>
                    <motion.div 
                      className={styles.quickViewOverlay} 
                      initial={{ opacity: 0 }} 
                      whileHover={{ opacity: 1 }}
                    >
                      <button onClick={() => handlePostClick(post)} className={styles.quickViewButton}>
                        <FiEye /> Quick View
              </button>
                    </motion.div>
                  </motion.div>
                  <div className={styles.cardsContent}>
                    <motion.h3 
                      className={styles.title}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      {post.caption}
                    </motion.h3>
                    <motion.div 
                      className={styles.disc} onClick={() => {
                        if (post.user_id === currentUserId) {
                          router.push('/newprofile');
                        } else {
                          router.push(`/someoneProfile/${post.user_id}`);
                        }
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <img src={post.profile_pic} alt={post.user_details?.username || post.user?.username} className={styles.discprofile_pic} />
                      <span>@{post.user_details?.username || post.user?.username}</span>
                    </motion.div>
                    <div className={styles.price}>${post.design.price}</div>
                    <div className={styles.cardActions}>
                      <motion.button 
                        className={styles.addToCartButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(post)}
                      >
                        <FaShoppingCart /> Add to Cart
                      </motion.button>
                          </div>
                      </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Show More/Less Button */}
          {posts.length > visiblePosts && (
            <motion.div 
              className={styles.showMoreContainer}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.button 
                className={styles.showMoreButton}
                onClick={handleShowMore}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showAllPosts ? 'Show Less' : `Show More (${posts.length - visiblePosts} more)`}
              </motion.button>
            </motion.div>
                )}
              </div>
      </section>

      {/* Modal */}
      {selectedPost && (
        <div className={styles1.modalOverlay} onClick={handleCloseModal}>
          <div className={styles1.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles1.modalLeft}>
              <img 
                src={selectedPost.design.image_url} 
                alt={selectedPost.caption} 
                className={`${styles1.postImage} ${selectedPost.design.type === 'customed rubber case' ? styles1.postImagerubber : styles1.postImageclear}`} 
              />
        </div>

            <div className={styles1.modalRight}>
              <div className={styles1.modalHeader}>
                <h2>{selectedPost.caption}</h2>
                <button className={styles1.closeButton} onClick={handleCloseModal}>×</button>
          </div>

              <div className={styles1.modalBody}>
                <div className={styles1.creatorInfo}>
                  <div className={styles1.creatorHeader}> 
                    <img 
                      src={selectedPost.profile_pic || "/inspiration/e66ea461e14e113f67aa0b34db419404.jpg"} 
                      alt={selectedPost.user_details?.username || selectedPost.user?.username} 
                      className={styles1.creatorAvatar} 
                    />

                    <div className={styles1.creatorDetails}>
                      <span className={styles1.creatorName}>{selectedPost.user_details?.first_name || selectedPost.first_name} {selectedPost.user_details?.last_name || ''}</span>
                      <span className={styles1.creatorUsername} onClick={() => {
                        if (selectedPost.user_id === currentUserId) {
                          router.push('/newprofile');
                        } else {
                          router.push(`/someoneProfile/${selectedPost.user_id}`);
                        }
                      }}>@{selectedPost.user_details?.username || selectedPost.user?.username}</span>
          </div>
          </div>
                  <div className={styles1.userDescription}>
                    <p className={styles1.userDescriptionText}>
                      {selectedPost.description}
                    </p>
            </div>
          </div>

                <div className={styles1.postDescription}>
                  <div className={styles1.descriptionHeader}>
                    <h3 className={styles1.descriptionTitle}>Case Description</h3>
                  </div>
                  <p className={styles1.descriptionText}>A mesmerizing blend of vibrant colors and fluid shapes that creates a sense of movement and harmony. This design captures the essence of abstract art while maintaining a modern, minimalist aesthetic. Perfect for those who appreciate contemporary art and want to make a bold statement with their phone case.

The case features a premium matte finish that enhances the colors and provides a comfortable grip. The design is printed using high-quality UV printing technology, ensuring long-lasting vibrancy and durability.</p>

                  <div className={styles1.descriptionTags}>
                    {selectedPost.hashtag_names && selectedPost.hashtag_names.map((tag: string, index: number) => (
                      <span key={index} className={styles1.tag}>#{tag}</span>
                    ))}
            </div>
          </div>

                <div className={styles1.postInfo}>
                  <div className={styles1.infoItem}>
                    <div className={styles1.infoIcon}>
                      <FaCalendarAlt />
          </div>
                    <div className={styles1.infoContent}>
                      <span className={styles1.infoLabel}>Posted on</span>
                      <span className={styles1.infoValue}>
                        {new Date(selectedPost.created_at).toLocaleDateString()}
                      </span>
        </div>
      </div>
                  <div className={styles1.infoItem}>
                    <div className={styles1.infoIcon}>
                      <FaMobile />
                    </div>
                    <div className={styles1.infoContent}>
                      <span className={styles1.infoLabel}>Phone Model</span>
                      <span className={styles1.infoValue}>{selectedPost.design.modell}</span>
                    </div>
                  </div>
                  <div className={styles1.infoItem}>
                    <div className={styles1.infoIcon}>
                      <FaTag />
                    </div>
                    <div className={styles1.infoContent}>
                      <span className={styles1.infoLabel}>Case Type</span>
                      <span className={styles1.infoValue}>{selectedPost.design.type === "customed clear case" ? "Clear Case" : 'Rubber Case'}
                      </span>
              </div>
            </div>
                  <div className={styles1.infoItem}>
                    <div className={styles1.infoIcon}>
                      <FaDollarSign />
                    </div>
                    <div className={styles1.infoContent}>
                      <span className={styles1.infoLabel}>Price</span>
                      <span className={styles1.infoValue}>${selectedPost.design.price}</span>
                    </div>
                  </div>
              </div>

                <div className={styles1.interactionBar}>
                  <button className={`${styles1.interactionButton} ${isLiked ? styles1.active : ''}`} onClick={() => handleLike(selectedPost.id)}>
                    {isLiked ? <FaHeart /> : <FaRegHeart />}
                    <span className={styles1.interactionCount}>{selectedPost.like_count}</span>
                  </button>
                  <button className={`${styles1.interactionButton} ${isSaved ? styles1.active : ''}`} onClick={() => handleFavorite(selectedPost.id)}>
                    {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                    <span className={styles1.interactionCount}>{selectedPost.favorite_count}</span>
                  </button>
                  <button 
                    className={styles1.addToCartButton}
                    onClick={() => handleAddToCart(selectedPost)}
                  >
                    <FaShoppingCart />
                    <span>Add to Cart</span>
              </button>
            </div>

                <div className={styles1.commentsSection}>
                  <div className={styles1.commentsHeader}>
                    <h3>Comments</h3>
                    <span className={styles1.commentCount}>{selectedPost.comments?.length || 0}</span>
                  </div>
                  
                  <form className={styles1.commentInput} onSubmit={(e) => handleComment(e, selectedPost.id)}>
                    <input
                      type="text"
                      name="content"
                      placeholder="Add a comment..."

                      required
                    />
                    <button type="submit">Submit</button>
                  </form>

                  <div className={styles1.commentsList}>
                    {selectedPost.comments && selectedPost.comments.length > 0 ? (
                      selectedPost.comments.map((comment: any) => {
                        // Get current user info from token
                        const token = localStorage.getItem('token');
                        const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).user_id : null;
                        const isCommentOwner = currentUserId === comment.user_id;
                        
                        return (
                          <div key={comment.id} className={styles1.comment}>
                            <img 
                              src={comment.profile_pic || "/inspiration/e66ea461e14e113f67aa0b34db419404.jpg"} 
                              alt={comment.username} 
                              className={styles1.commentAvatar} 
                            />
                            <div className={styles1.commentContent}>
                              <div className={styles1.commentHeader}>
                                <span className={styles1.commentAuthor} onClick={() => {
                                  if (comment.user_id === currentUserId) {
                                    router.push('/newprofile');
                                  } else {
                                    router.push(`/someoneProfile/${comment.user_id}`);
                                  }
                                }}>{comment.username}</span>
                                <span className={styles1.commentDate}>
                                  {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className={styles1.commentBody}>
                                <p className={styles1.commentText}>{comment.content}</p>
                                {isCommentOwner && (
                                  <button 
                                    className={styles1.deleteCommentButton}
                                    onClick={() => handleDeleteComment(comment.id, selectedPost.id)}
                                    title="Delete comment"
                                  >
                                    <FaTrash />
              </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className={styles1.noComments}>
                        <p>No comments yet. Be the first to comment!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CategoryPage;

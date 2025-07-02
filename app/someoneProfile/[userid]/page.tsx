"use client";

import React, { useEffect, useState } from "react";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import styles from "../someoneProfile.module.css";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, MessageCircle, Bookmark, Calendar, TrendingUp, Clock, ThumbsUp, Grid, List, MessageSquare } from "lucide-react";
import Layout from "../../newui/layout";
import styles1 from "../../newui/newui.module.css";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaShoppingCart, FaMobile, FaTag, FaCalendarAlt, FaDollarSign, FaTrash } from 'react-icons/fa';
import { useToast } from "../../utils/ToastContext";

// Real API fetch functions
const fetchUserProfile = async (userId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${userId}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

const fetchUserPosts = async (userId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${userId}/posts/`);
    if (!response.ok) {
      throw new Error('Failed to fetch user posts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

const fetchUserMostLikedPosts = async (userId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${userId}/posts/most-liked/`);
    if (!response.ok) {
      throw new Error('Failed to fetch most liked posts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching most liked posts:', error);
    throw error;
  }
};

const fetchUserMostCommentedPosts = async (userId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${userId}/posts/most-commented/`);
    if (!response.ok) {
      throw new Error('Failed to fetch most commented posts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching most commented posts:', error);
    throw error;
  }
};

// Helper to fetch posts with optional as_user param
const fetchUserPostsWithAsUser = async (userId: string, asUserId?: string) => {
  let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${userId}/posts/`;
  if (asUserId) {
    url += `?as_user=${asUserId}`;
  }
  const token = localStorage.getItem('token');
  const headers: any = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error('Failed to fetch posts');
  return await response.json();
};

type SortOption = "recent" | "most_liked" | "most_commented" | "most_favorited";

// Copy the component definitions from newprofile/page.tsx:

interface AvatarProps {
  className?: string;
  children: ReactNode;
}
const Avatar = ({ className = "", children }: AvatarProps) => (
  <div className={`${styles.avatar} ${className}`}>{children}</div>
);

interface AvatarImageProps {
  src: string;
  alt: string;
}
const AvatarImage = ({ src, alt }: AvatarImageProps) => (
  <img
    src={src || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"}
    alt={alt}
    className={styles.avatarImage}
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.style.display = "none";
      const fallback = target.nextElementSibling as HTMLElement;
      if (fallback) {
        fallback.style.display = "flex";
      }
    }}
  />
);

interface AvatarFallbackProps {
  className?: string;
  children: ReactNode;
}
const AvatarFallback = ({ className = "", children }: AvatarFallbackProps) => (
  <div className={`${styles.avatarFallback} ${className}`} style={{ display: "none" }}>
    {children}
  </div>
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "icon";
  className?: string;
  children: ReactNode;
}
const Button = ({ variant = "default", size = "default", className = "", children, ...props }: ButtonProps) => (
  <button
    className={`${styles.button} ${styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} ${styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

interface CardProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}
const Card = ({ className = "", children, onClick }: CardProps) => (
  <div className={`${styles.card} ${className}`} onClick={onClick}>
    {children}
  </div>
);

const CardContent = ({ className = "", children }: { className?: string; children: ReactNode }) => (
  <div className={`${styles.cardContent} ${className}`}>{children}</div>
);

interface BadgeProps {
  variant?: "default" | "secondary";
  className?: string;
  children: ReactNode;
}
const Badge = ({ variant = "default", className = "", children }: BadgeProps) => (
  <span
    className={`${styles.badge} ${styles[`badge${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} ${className}`}
  >
    {children}
  </span>
);

// Helper to format date as dd/mm/yy
function formatDateDMY(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}
// Helper to get relative time (e.g., '1 day ago')
function getRelativeTime(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

export default function SomeoneProfile() {
  const params = useParams();
  const userId = params?.userid as string || "1";
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [mostLikedPosts, setMostLikedPosts] = useState<any[]>([]);
  const [mostCommentedPosts, setMostCommentedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [viewMode, setViewMode] = useState<"detailed" | "simple">("detailed");
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [showAsProfileOwner, setShowAsProfileOwner] = useState(false);
  const { showToast } = useToast();
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
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const [userData, likedPosts, commentedPosts] = await Promise.all([
          fetchUserProfile(userId),
          fetchUserMostLikedPosts(userId),
          fetchUserMostCommentedPosts(userId)
        ]);
        setUser(userData);
        // Fetch posts for current user or as profile owner
        const userPosts = await fetchUserPostsWithAsUser(userId, showAsProfileOwner ? userId : undefined);
        setPosts(userPosts);
        setMostLikedPosts(likedPosts);
        setMostCommentedPosts(commentedPosts);
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId, showAsProfileOwner]);

  // Get posts based on selected sort option
  const sortedPosts = React.useMemo(() => {
    let postsToShow = [...posts]; // Default to recent posts
    
    switch (sortBy) {
      case "recent":
        postsToShow = [...posts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "most_liked":
        postsToShow = mostLikedPosts;
        break;
      case "most_commented":
        postsToShow = mostCommentedPosts;
        break;
      case "most_favorited":
        postsToShow = [...posts].sort((a, b) => (b.favorite_count || 0) - (a.favorite_count || 0));
        break;
      default:
        postsToShow = posts;
    }
    
    return postsToShow;
  }, [posts, mostLikedPosts, mostCommentedPosts, sortBy]);

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setIsLiked(post.is_liked);
    setIsSaved(post.is_favorited);
    console.log("post data : ",post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleLike = async (postId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Please log in to like posts', "error");
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
        // Update selectedPost/modal state
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost((prev: any) => prev ? { ...prev, like_count: data.like_count, is_liked: data.is_liked } : null);
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
      showToast('You must be logged in to save posts.', "error");
      return;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/favorite/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      // Update modal state
      setIsSaved(data.is_favorited);
      setSelectedPost((prev: any) => prev && prev.id === postId ? { ...prev, favorite_count: data.favorite_count, is_favorited: data.is_favorited } : prev);
      // Update posts array
      setPosts(posts => posts.map(p => p.id === postId ? { ...p, favorite_count: data.favorite_count, is_favorited: data.is_favorited } : p));
      // Also update mostLikedPosts and mostCommentedPosts if present
      setMostLikedPosts(posts => posts.map(p => p.id === postId ? { ...p, favorite_count: data.favorite_count, is_favorited: data.is_favorited } : p));
      setMostCommentedPosts(posts => posts.map(p => p.id === postId ? { ...p, favorite_count: data.favorite_count, is_favorited: data.is_favorited } : p));
    }
  };

  const handleAddToCart = (product: any) => {
    if (product.design.stock === 'Out of Stock') {
      showToast("Sorry, this item is currently out of stock and cannot be added to cart.", "error");
      return;
    }
    const cartItem = {
      id: product.design.id,
      name: product.caption,
      image: product.design.image_url,
      price: product.design.price,
      type: product.design.type,
      modell: product.design.modell,
      quantity: 1
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || '[]');
    const index = existingCart.findIndex((item: any) => item.id === cartItem.id);

    if (index > -1) {
      existingCart[index].quantity += 1;
      showToast("This item is already in the cart. Quantity increased.");
    } else {
      existingCart.push(cartItem);
      showToast("Added to cart!", "success");
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleComment = async (e: React.FormEvent<HTMLFormElement>, postId: number) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Please log in to comment');
      return;
    }
    if (!commentInput.trim()) {
      showToast('Please enter a comment', "error");
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/comment/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: commentInput }),
      });
      if (response.ok) {
        const data = await response.json();
        const newComment = {
          id: data.comment.id,
          content: commentInput,
          created_at: new Date().toISOString(),
          user_id: data.comment.user_id,
          username: data.comment.username,
          profile_pic: data.comment.profile_pic,
          first_name: data.comment.first_name,
        };
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost((prev: any) => prev ? {
            ...prev,
            comment_count: prev.comment_count + 1,
            comments: [...(prev.comments || []), newComment]
          } : null);
        }
        setCommentInput("");
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
      showToast('Please log in to delete comments');
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
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost((prev: any) => prev ? {
            ...prev,
            comment_count: prev.comment_count - 1,
            comments: prev.comments.filter((comment: any) => comment.id !== commentId)
          } : null);
        }
      } else {
        console.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.pageWrapper}>
          <div className={styles.loadingContainer}>
            Loading profile...
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !user) {
    return (
      <Layout>
        <div className={styles.pageWrapper}>
          <div className={styles.errorContainer}>
            {error || "User not found"}
          </div>
        </div>
      </Layout>
    );
  }

  // Use user statistics from backend
  const totalPosts = user?.statistics?.total_posts || 0;
  const totalLikes = user?.statistics?.total_likes || 0;
  const totalComments = user?.statistics?.total_comments || 0;
  const totalFavorites = user?.statistics?.total_favorites || 0;

  return (
    <Layout>
      <div className={styles.pageWrapper}>
        {/* Back Button */}
        <Link href="/" className={styles.backButton}>
          <ArrowLeft className={styles.backIcon} />
        </Link>

        {/* ProfileBannerSection */}
        <div className={styles.profileBannerSection}>
          <img
            src={user.profile_pic}
            alt={user.username}
            className={styles.profileAvatar}
          />
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>
              {user.first_name} {user.last_name}
            </div>
            <div className={styles.profileUsername}>
              @{user.username}
            </div>
            <div className={styles.profileEmail}>
              {user.email}
            </div>
            <div className={styles.profileJoined}>
              <Calendar size={16} />
              Joined {new Date(user.date_joined).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* StatsBar */}
        <div className={styles.statsBar}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{totalPosts}</div>
            <div className={styles.statLabel}>Posts</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{totalLikes}</div>
            <div className={styles.statLabel}>Likes</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{totalComments}</div>
            <div className={styles.statLabel}>Comments</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{totalFavorites}</div>
            <div className={styles.statLabel}>Saved</div>
          </div>
        </div>

        {/* Toggle to show posts as liked by profile owner */}


        {/* PostsGallerySection */}
        <div className={styles.postsGallerySection}>
          <div className={styles.galleryHeader}>
            <div className={styles.galleryTitle}>Posts</div>
            {/* Tabs/Filters */}
            <div className={styles.tabsContainer}>
              <button
                className={`${styles.tabButton} ${sortBy === "recent" ? styles.tabButtonActive : ""}`}
                onClick={() => setSortBy("recent")}
              >
                <Clock size={14} style={{ marginRight: "4px" }} />
                Recent
              </button>
              <button
                className={`${styles.tabButton} ${sortBy === "most_liked" ? styles.tabButtonActive : ""}`}
                onClick={() => setSortBy("most_liked")}
              >
                <ThumbsUp size={14} style={{ marginRight: "4px" }} />
                Most Liked
              </button>
              <button
                className={`${styles.tabButton} ${sortBy === "most_commented" ? styles.tabButtonActive : ""}`}
                onClick={() => setSortBy("most_commented")}
              >
                <MessageCircle size={14} style={{ marginRight: "4px" }} />
                Most Commented
              </button>
              <button
                className={`${styles.tabButton} ${sortBy === "most_favorited" ? styles.tabButtonActive : ""}`}
                onClick={() => setSortBy("most_favorited")}
              >
                <Bookmark size={14} style={{ marginRight: "4px" }} />
                Most Saved
              </button>
            </div>
          </div>
          {/* View Mode Toggle - now below galleryHeader */}
          <div className={styles.viewToggleContainer}>
            <button
              className={`${styles.viewToggleButton} ${viewMode === "detailed" ? styles.viewToggleButtonActive : ""}`}
              onClick={() => setViewMode("detailed")}
              title="Detailed view"
            >
              <List size={18} />
            </button>
            <button
              className={`${styles.viewToggleButton} ${viewMode === "simple" ? styles.viewToggleButtonActive : ""}`}
              onClick={() => setViewMode("simple")}
              title="Simple grid view"
            >
              <Grid size={18} />
            </button>
          </div>
          
          <div className={styles.postsList}>
            {sortedPosts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyTitle}>No posts yet</div>
                <div className={styles.emptyText}>
                  This user hasn't shared any designs yet.
                </div>
              </div>
            ) : viewMode === "detailed" ? (
              // Detailed view (existing)
              sortedPosts.map((post) => (
                <Card key={post.id} className={styles.postCard} onClick={() => handlePostClick(post)}>
                  <CardContent className={styles.postContentWithImage}>
                    <div className={styles.postHeader}>
                      <div className={styles.postAuthor}>
                        <Avatar className={styles.postAuthorAvatar}>
                          <AvatarImage
                            src={user.profile_pic}
                            alt={user.first_name}
                          />
                          <AvatarFallback>{user.first_name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div className={styles.postAuthorInfo}>
                          <p className={styles.postAuthorName}>{user.first_name} {user.last_name}</p>
                          <p className={styles.postTimestamp}>{formatDateDMY(post.created_at)}</p>
                        </div>
                      </div>
                      <Badge
                        variant={post.design?.type === "clear" ? "default" : "secondary"}
                        className={styles.postTypeBadge}
                      >
                        {post.design?.type === 'customed clear case' ? 'Clear' : 'Rubber'}
                      </Badge>
                    </div>

                    <h3 className={styles.postTitle}>{post.caption}</h3>
                    <p className={styles.postText}>{post.description}</p>

                    {post.design?.image_url && (
                      <div className={styles.postImageContainer}>
                        <img src={post.design.image_url} alt={post.caption} className={styles.postImage} />
                      </div>
                    )}

                    <div className={styles.postActions}>
                      <div className={styles.postStats}>
                        <div className={styles.postStat}>
                          <Heart className={styles.postStatIcon} />
                          <span>{post.like_count || 0} likes</span>
                        </div>
                        <div className={styles.postStat}>
                          <MessageCircle className={styles.postStatIcon} />
                          <span>{post.comment_count || 0} comments</span>
                        </div>
                        <div className={styles.postStat}>
                          <Bookmark className={styles.postStatIcon} />
                          <span>{post.favorite_count || 0} saved</span>
                        </div>
                      </div>
                      <div className={styles.postActionButtons}>
                        <Button variant="ghost" size="sm" className={styles.postActionButton}>
                          <Heart className={styles.postActionIcon} />
                        </Button>
                        <Button variant="ghost" size="sm" className={styles.postActionButton}>
                          <MessageCircle className={styles.postActionIcon} />
                        </Button>
                        <Button variant="ghost" size="sm" className={styles.postActionButton}>
                          <Bookmark className={styles.postActionIcon} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Simple view
              <div className={styles.simplePostsGrid}>
                {sortedPosts.map((post) => (
                  <Card key={post.id} className={styles.simplePostCard} onClick={() => handlePostClick(post)}>
                    <CardContent className={styles.simplePostContent}>
                      <h3 className={styles.simplePostTitle}>{post.caption}</h3>
                      {post.design?.image_url && (
                        <div className={styles.simplePostImageContainer}>
                          <img src={post.design.image_url} alt={post.caption} className={styles.simplePostImage} />
                        </div>
                      )}
                      {/* Stats and date row */}
                      <div className={styles.simplePostMetaRow}>
                        <div className={styles.simplePostStats}>
                          <div className={styles.simplePostStat}>
                            <Heart className={styles.simplePostStatIcon} />
                            <span>{post.like_count || 0}</span>
                          </div>
                          <div className={styles.simplePostStat}>
                            <MessageSquare className={styles.simplePostStatIcon} />
                            <span>{post.comment_count || 0}</span>
                          </div>
                          <div className={styles.simplePostStat}>
                            <Bookmark className={styles.simplePostStatIcon} />
                            <span>{post.favorite_count || 0}</span>
                          </div>
                        </div>
                        <div className={styles.simplePostDate}>{getRelativeTime(post.created_at)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
                      alt={selectedPost.user} 
                      className={styles1.creatorAvatar} 
                    />

                    <div className={styles1.creatorDetails}>
                      <span className={styles1.creatorName}>{selectedPost.user_details.first_name} {selectedPost.user_details.last_name}</span>
                      <span className={styles1.creatorUsername}>@{selectedPost.user}</span>
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
                    Add to Cart - ${selectedPost.design.price}
                  </button>
                </div>

                <div className={styles1.commentsSection}>
                  <div className={styles1.commentsHeader}>
                    <h3>Comments</h3>
                    <span className={styles1.commentCount}>{selectedPost.comment_count}</span>
                  </div>
                
                  <form className={styles1.commentInput} onSubmit={(e) => handleComment(e, selectedPost.id)}>
                    <input
                      type="text"
                      name="content"
                      placeholder="Add a comment..."
                      value={commentInput}
                      onChange={e => setCommentInput(e.target.value)}
                      className={styles1.commentInputBox}
                      autoComplete="off"
                    />
                    <button type="submit" className={styles1.commentSubmitButton}>Post</button>
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
}

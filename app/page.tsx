"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '../app/newui/newui.module.css';
import styles1 from '../app/newexplore/newexplore.module.css';

import Layout from '../app/newui/layout';
import { useRouter } from "next/navigation";

import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaComment, FaShoppingCart, FaMobile, FaTag, FaCalendarAlt, FaDollarSign, FaUpload, FaMobileAlt, FaEye, FaLock, FaShare, FaArrowRight, FaPlane, FaUndo, FaMapMarkerAlt, FaEnvelope, FaInstagram, FaTiktok, FaPinterest, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { fetchMostLikedDesigns, fetchTopUsersByLikes } from '../app/utils/apiUtils';

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
}
const userHashtags = [
  ["Minimalist", "Geometric", "Modern", "Clean"],
  ["PopArt", "Colorful", "Bold", "Vibrant"],
  ["Nature", "Landscape", "Photography", "Outdoor"],
  ["Typography", "Abstract", "Modern", "Creative"],
  // Add more if you want to support more users
];
const CountUp: React.FC<CountUpProps> = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const startValue = 0;
    const endValue = end;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentCount = Math.floor(progress * (endValue - startValue) + startValue);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return (
    <span ref={countRef}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

interface Comment {
  author: string;
  avatar: string;
  text: string;
  date: string;
}

interface Post {
  title: string;
  artist: string;
  image: string;
  price: number;
  date: string;
  model: string;
  type: string;
  likes: number;
  favorites: number;
  description: string;
  tags: string[];
  comments: Comment[];
}

interface BackendPost {
  id: number;
  caption: string;
  description: string;
  created_at: string;
  user: {
    id: number;
    username: string;
    profile_pic: string;
  };
  user_id: number;
  first_name: string;
  last_name: string;

  profile_pic: string;
  user_details: {
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
  design: {
    id: number;
    image_url: string;
    modell: string;
    type: string;
    price: number;
    stock: string;
    sku: string;
    theclass: string;
    color1: string;
    color2: string;
    color3: string;
  };
  like_count: number;
  comment_count: number;
  favorite_count: number;
  hashtag_names: string[];
  comments: {
    id: number;
    content: string;
    created_at: string;
    user_id: number;
    username: string;
    profile_pic: string;
    first_name: string;
  }[];
  is_liked: boolean;
  is_favorited: boolean;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const cardWidth = 300;
  const gap = 30;
  const padding = 40;

  const [visibleCards, setVisibleCards] = useState(1);
  const [totalSlides, setTotalSlides] = useState(1);

  const [selectedPost, setSelectedPost] = useState<Post | BackendPost | null>(null);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [topUsers, setTopUsers] = useState([]);

  const [mostLikedData, setMostLikedData] = useState([]);
const [mostLikedLoading, setMostLikedLoading] = useState(false);
const [mostLikedError, setMostLikedError] = useState(null);
const totalCards = mostLikedData.length;


useEffect(() => {
  const fetchMostLiked = async () => {
    try {
      setMostLikedLoading(true);
      setMostLikedError(null);
      const data = await fetchMostLikedDesigns();
      setMostLikedData(data);
    } catch (error) {
      setMostLikedError(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setMostLikedLoading(false);
    }
  };
  fetchMostLiked();
}, []);

  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  useEffect(() => {
    // Fetch current user info from your backend
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
  fetchTopUsersByLikes()
    .then(data => setTopUsers(data.slice(0, 4))) // Only show 4 users
    .catch(console.error);
}, []);

useEffect(() => {
  const calculateSlides = () => {
    if (!sliderRef.current) return;
    const containerWidth = sliderRef.current.offsetWidth;
    const visible = Math.max(1, Math.floor((containerWidth - padding) / (cardWidth + gap)));
    setVisibleCards(visible);
    setTotalSlides(Math.max(1, Math.ceil(totalCards / visible)));
  };
  calculateSlides();
  window.addEventListener('resize', calculateSlides);
  return () => window.removeEventListener('resize', calculateSlides);
}, [totalCards]);

  // Calculate max slide index and dot count
  const maxSlideIndex = Math.max(0, Math.ceil((totalCards - visibleCards) / visibleCards));
  const dotCount = Math.max(1, maxSlideIndex + 1);

  const scrollToSlide = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, maxSlideIndex));
    if (sliderRef.current) {
      const slideWidth = (cardWidth * visibleCards) + (gap * (visibleCards - 1));
      sliderRef.current.scrollTo({
        left: clampedIndex * slideWidth,
        behavior: 'smooth'
      });
      setCurrentSlide(clampedIndex);
    }
  };

  const nextSlide = () => {
    if (currentSlide < maxSlideIndex) {
      scrollToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      scrollToSlide(currentSlide - 1);
    }
  };

  // Add to cart handler from newexplore
  const handleAddToCart = (product: BackendPost) => {
    if (product.design.stock === 'Out of Stock') {
      alert("Sorry, this item is currently out of stock and cannot be added to cart.");
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
      alert("This item is already in the cart. Quantity increased.");
    } else {
      existingCart.push(cartItem);
      alert("Added to cart!");
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Update handlePostClick to set isLiked and isSaved from post
  const handlePostClick = (post: Post | BackendPost) => {
    setSelectedPost(post);
    if (isBackendPost(post)) {
      setIsLiked(post.is_liked);
      setIsSaved(post.is_favorited);
    }
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
        setMostLikedData((prev: any) =>
          prev.map((post: any) =>
            post.id === postId
              ? {
                  ...post,
                  like_count: data.like_count,
                  is_liked: data.is_liked,
                }
              : post
          )
        );
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost((prev: any) =>
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
        setMostLikedData((prev: any) =>
          prev.map((post: any) =>
            post.id === postId
              ? {
                  ...post,
                  favorite_count: data.favorite_count,
                  is_favorited: data.is_favorited,
                }
              : post
          )
        );
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost((prev: any) =>
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
        const newComment = {
          id: data.comment.id,
          content: content,
          created_at: new Date().toISOString(),
          user_id: data.comment.user_id,
          username: data.comment.username,
          profile_pic: data.comment.profile_pic,
          first_name: data.comment.first_name,
        };
        setMostLikedData((prev: any) =>
          prev.map((post: any) =>
            post.id === postId
              ? {
                  ...post,
                  comment_count: post.comment_count + 1,
                  comments: [...(post.comments || []), newComment],
                }
              : post
          )
        );
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost((prev: any) =>
            prev
              ? {
                  ...prev,
                  comment_count: prev.comment_count + 1,
                  comments: [...(prev.comments || []), newComment],
                }
              : null
          );
        }
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
        setMostLikedData((prev: any) =>
          prev.map((post: any) =>
            post.id === postId
              ? {
                  ...post,
                  comment_count: post.comment_count - 1,
                  comments: post.comments.filter((comment: any) => comment.id !== commentId),
                }
              : post
          )
        );
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost((prev: any) =>
            prev
              ? {
                  ...prev,
                  comment_count: prev.comment_count - 1,
                  comments: prev.comments.filter((comment: any) => comment.id !== commentId),
                }
              : null
          );
        }
      } else {
        console.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Add a type guard for BackendPost
  function isBackendPost(post: any): post is BackendPost {
    return post && typeof post === 'object' && 'id' in post && 'user_details' in post && 'design' in post;
  }

  return (
    
    <Layout>
    <div>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Transform Your Phone into 
              <span className={styles.highlight}> Art</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Create custom phone cases that reflect your unique style. 
              Express yourself with our easy-to-use design platform.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/newdesign" className={styles.primaryButton}>
                <i className="fas fa-palette"></i>
                Start Creating
              </Link>
              <Link href="/newexplore" className={styles.secondaryButton}>
                <i className="fas fa-compass"></i>
                Explore Designs
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  <CountUp end={10} suffix="K+" />
                </span>
                <span className={styles.statLabel1}>Active Artists</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  <CountUp end={50} suffix="K+" />
                </span>
                <span className={styles.statLabel1}>Designs Created</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  <CountUp end={4.9} duration={1500} />
                </span>
                <span className={styles.statLabel1}>User Rating</span>
              </div>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.imageContainer}>
              <img 
                src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" 
                alt="Custom Phone Case Design" 
                className={styles.mainImage}
              />
              <div className={styles.floatingBadge}>
                <i className="fas fa-star"></i>
                <span>Trending Design</span>
              </div>
              <div className={styles.imageOverlay}>
                <div className={styles.overlayContent}>
                  <span className={styles.overlayText}>Custom Made</span>
                  <span className={styles.overlayPrice}>From $29.99</span>
                </div>
              </div>
            </div>
            <div className={styles.imageDecoration}>
              <div className={styles.decorationCircle}></div>
              <div className={styles.decorationSquare}></div>
              <div className={styles.decorationDots}></div>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.tutorialSection}>
        <div className={styles.tutorialDecoration}>
          <div className={styles.tutorialHexagon}></div>
          <div className={styles.tutorialTriangle}></div>
          <div className={styles.tutorialWave}></div>
          <div className={styles.tutorialDiamond}></div>
       
          <div className={styles.tutorialSpiral}></div>
        </div>
        <div className={styles.tutorialHeader}>
          <motion.h2 
            className={styles.tutorialTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Create Your <span className={styles.highlight2}>Perfect</span> Case
          </motion.h2>
          <motion.p 
            className={styles.tutorialSubtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A simple journey to your custom phone case
          </motion.p>
        </div>

        <div className={styles.tutorialTimeline}>
          <motion.div 
            className={styles.timelineStep}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.timelineIcon}>
                <FaUpload />
              </div>
              <div className={styles.timelineInfo}>
                <h3>Upload</h3>
                <p>Select your favorite artwork or photo</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={styles.timelineStep}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.timelineIcon}>
                <FaMobileAlt />
              </div>
              <div className={styles.timelineInfo}>
                <h3>Select</h3>
                <p>Choose your phone model and case style</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={styles.timelineStep}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.timelineIcon}>
                <FaEye />
              </div>
              <div className={styles.timelineInfo}>
                <h3>Customize</h3>
                <p>Adjust size, position, and effects</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={styles.timelineStep}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.timelineIcon}>
                <FaLock />
              </div>
              <div className={styles.timelineInfo}>
                <h3>Checkout</h3>
                <p>Secure payment and order confirmation</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={styles.timelineStep}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className={styles.timelineContent}>
              <div className={styles.timelineIcon}>
                <FaShare />
              </div>
              <div className={styles.timelineInfo}>
                <h3>Share</h3>
                <p>Show off your unique design</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className={styles.tutorialCTA}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link href="/newdesign" className={styles.tutorialButton}>
            Start Customizing Now
            <FaArrowRight />
          </Link>
        </motion.div>
      </section>



      <section className={styles.artistsSection}>
        <div className={styles.artistsDecoration}>
          <div className={styles.artistsShape + ' ' + styles.artistsShape1}></div>
          <div className={styles.artistsShape + ' ' + styles.artistsShape2}></div>
          <div className={styles.artistsShape + ' ' + styles.artistsShape3}></div>
          <div className={styles.artistsShape + ' ' + styles.artistsShape4}></div>
        </div>
        <div className={styles.artistsHeader}>
          <motion.h2 
            className={styles.artistsTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Featured Creators
          </motion.h2>
          <motion.p 
            className={styles.artistsSubtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Meet the talented artists behind our most popular designs
          </motion.p>
        </div>

        <div className={styles.artistsGrid}>
  {topUsers.map((user, index) => (
    <motion.div
      key={user.user_id}
      className={styles.artistCard}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
    >
      <div className={styles.artistPreview}>
        <img src={user.profile_pic} alt={`${user.first_name}'s work`} />
        <div className={styles.artistOverlay}>
          <div className={styles.artistStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{user.total_posts}</span>
              <span className={styles.statLabel}>Posts</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{user.total_likes}</span>
              <span className={styles.statLabel}>Likes</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.artistContent}>
        <div className={styles.artistHeader}>
          <img 
            src={user.profile_pic} 
            alt={user.first_name} 
            className={styles.artistAvatar}
          />
          <div className={styles.artistInfo}>
            <h3 className={styles.artistName}>{user.first_name} {user.last_name}</h3>
            <span className={styles.artistRole}>@{user.username}</span>
          </div>
        </div>
        <p className={styles.artistDescription}>
          {/* You can use a static or generated description here */}
          {user.first_name} is one of our most popular creators, known for their unique style and engaging posts.
        </p>
        <div className={styles.artistTags}>
          {userHashtags[index]?.map((tag, i) => (
            <span key={i} className={styles.artistTag}>#{tag}</span>
          ))}
        </div>
        <button className={styles.viewProfileBtn} onClick={() => {
    if (user.user_id === currentUserId) {
      router.push('/newprofile');
    } else {
      router.push(`/someoneProfile/${user.user_id}`);
    }
  }}>
          View Portfolio
          <FaArrowRight />
        </button>
      </div>
    </motion.div>
  ))}
</div>
      </section>



      <div className={styles.featuredSectionWrapper}>
        <div className={styles.featuredSection}>
          <div className={styles.featuredDecoration}>
            <div className={styles.featuredShape1}></div>
            <div className={styles.featuredShape2}></div>
            <div className={styles.featuredShape3}></div>
            <div className={styles.featuredShape4}></div>
            <div className={styles.featuredShape5}></div>
          </div>
          <motion.div 
            className={styles.featuredHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>Featured Designs</h2>
            <p className={styles.sectionSubtitle}>Discover our most popular and trending phone case designs, crafted by talented artists from around the world</p>
          </motion.div>
          <div className={styles.sliderNav}>
            <motion.button 
              className={styles.sliderButton} 
              onClick={prevSlide}
              disabled={currentSlide <= 0}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <i className="fas fa-chevron-left"></i>
            </motion.button>
            <motion.button 
              className={styles.sliderButton} 
              onClick={nextSlide}
              disabled={currentSlide >= maxSlideIndex}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <i className="fas fa-chevron-right"></i>
            </motion.button>
          </div>
          <motion.div 
            className={styles.cardsGrid} 
            ref={sliderRef}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {mostLikedLoading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading most liked designs...</p>
              </div>
            ) : mostLikedError ? (
              <div className={styles.errorContainer}>
                <p>Error: {mostLikedError}</p>
                <button onClick={() => fetchMostLiked()}>Retry</button>
              </div>
            ) : mostLikedData.length === 0 ? (
              <div className={styles.emptyContainer}>
                <p>No designs have been liked yet.</p>
              </div>
            ) : (
              (() => {
                const backendPosts = mostLikedData.filter((post): post is BackendPost => typeof post.id === 'number');
                return backendPosts.slice(0, 12).map((post, index) => {
                  const backendPost = post as BackendPost;
                  return (
                    <div
                      key={backendPost.id}
                      className={styles.cards}
                    >
                      <div className={styles.imgBack}>
                        <img
                          className={backendPost.design.type === 'customed clear case'? styles.clearW : styles.rubberW}
                          src={backendPost.design?.image_url}
                          alt={backendPost.caption || backendPost.design?.modell || 'Untitled Design'}
                        />
                        <div className={styles.imageStats}  onClick={e => {
                          e.stopPropagation();
                          handlePostClick(backendPost);
                        }}>
                          <div className={styles.statRow}  >
                            <button
                              className={`${styles.statButton} ${backendPost.is_liked ? styles.liked : ''}`}
                              title="Like"
                              onClick={e => {
                                e.stopPropagation();
                                handleLike(backendPost.id);
                              }}
                            >
                              <i className="fas fa-heart"></i>
                              <span className={styles.statCount}>
                                {backendPost.like_count > 1000
                                  ? `${(backendPost.like_count / 1000).toFixed(1)}k`
                                  : backendPost.like_count}
                              </span>
                            </button>
                            <button
                              className={`${styles.statButton} ${backendPost.is_favorited ? styles.favorited : ''}`}
                              title="Save"
                              onClick={e => {
                                e.stopPropagation();
                                handleFavorite(backendPost.id);
                              }}
                            >
                              <i className="fas fa-bookmark"></i>
                              <span className={styles.statCount}>
                                {backendPost.favorite_count > 1000
                                  ? `${(backendPost.favorite_count / 1000).toFixed(1)}k`
                                  : backendPost.favorite_count}
                              </span>
                            </button>
                          </div>
                          <div className={styles.price}>${backendPost.design?.price}</div>
                        </div>
                      </div>
                      <div className={styles.cardsContent}>
                        <h3 className={styles.title}>
                          {backendPost.caption || backendPost.design?.modell || 'Untitled Design'}
                        </h3>
                        <div className={styles.disc} onClick={() => {
                          if (backendPost.user_id === currentUserId) {
                            router.push('/newprofile');
                          } else {
                            router.push(`/someoneProfile/${backendPost.user_id}`);
                          }
                        }}>
                          <img
                            src={backendPost.profile_pic || backendPost.user_details?.profile_pic}
                            alt="Artist"
                            className={styles.discprofile_pic}
                          />
                          <span>
                            By {backendPost.first_name || 'Unknown'} {backendPost.last_name }
                          </span>
                        </div>
                        <button className={styles.btn5} onClick={() => {
                          handleAddToCart(backendPost);
                        }}>
                          Add to Cart{backendPost.design?.price ? ` - $${backendPost.design.price}` : ""}
                        </button>
                      </div>
                    </div>
                  );
                });
              })()
            )}
          </motion.div>
          <motion.div 
  className={styles.sliderDots}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.4, delay: 0.4 }}
>
  {[...Array(dotCount)].map((_, index) => (
    <motion.div
      key={index}
      className={`${styles.dot} ${currentSlide === index ? styles.active : ''}`}
      onClick={() => scrollToSlide(index)}
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
    />
  ))}
</motion.div>
        </div>
      </div>


      <section className={styles.benefitsSection}>
        <div className={styles.benefitsDecoration}>
          <div className={styles.benefitsShape1}></div>
          <div className={styles.benefitsShape2}></div>
          <div className={styles.benefitsShape3}></div>
        </div>
        
        <motion.div 
          className={styles.benefitsHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.benefitsTitle}>
            Unlock <span className={styles.highlight2}>Exclusive</span> Benefits
          </h2>
          <p className={styles.benefitsSubtitle}>
            Join our community and enjoy special rewards for your creativity
          </p>
        </motion.div>

        <div className={styles.benefitsGrid}>
          <motion.div 
            className={styles.benefitCard}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.benefitImage}>
              <img src="/inspiration/893b756bfce5669f1cd39e39001234a0.jpg" alt="Early Access" />
              <div className={styles.benefitOverlay}>
                <span className={styles.benefitBadge}>New</span>
              </div>
            </div>
            <div className={styles.benefitContent}>
              <h3>Early Access</h3>
              <p>Be the first to try new features and exclusive designs</p>
              <ul className={styles.benefitList}>
                <li>Preview upcoming collections</li>
                <li>Test new customization tools</li>
                <li>Shape future features</li>
              </ul>
            </div>
          </motion.div>

          <motion.div 
            className={styles.benefitCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.benefitImage}>
              <img src="/inspiration/a9297bfffd3d208ec4dd05fdf8b84e1a.jpg" alt="Rewards Program" />
              <div className={styles.benefitOverlay}>
                <span className={styles.benefitBadge}>Popular</span>
              </div>
            </div>
            <div className={styles.benefitContent}>
              <h3>Rewards Program</h3>
              <p>Earn points for every action and redeem for exclusive perks</p>
              <ul className={styles.benefitList}>
                <li>Points for purchases</li>
                <li>Bonus for referrals</li>
                <li>Special member discounts</li>
              </ul>
            </div>
          </motion.div>

          <motion.div 
            className={styles.benefitCard}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className={styles.benefitImage}>
              <img src="/inspiration/cc74a43b9d2fd92c9af6f9bf9f7c750f.jpg" alt="Community Benefits" />
              <div className={styles.benefitOverlay}>
                <span className={styles.benefitBadge}>Featured</span>
              </div>
            </div>
            <div className={styles.benefitContent}>
              <h3>Community Benefits</h3>
              <p>Connect with fellow creators and grow together</p>
              <ul className={styles.benefitList}>
                <li>Exclusive workshops</li>
                <li>Collaboration opportunities</li>
                <li>Design challenges</li>
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className={styles.benefitsCTA}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link href="/signup" className={styles.benefitsButton}>
            Join Now
            <FaArrowRight />
          </Link>
          <p className={styles.benefitsNote}>
            Start earning rewards from your first purchase
          </p>
        </motion.div>
      </section>

      <section className={styles.shippingSection}>
        <div className={styles.shippingHeader}>
          <motion.h2 
            className={styles.shippingTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Shipping & Shopping Info
          </motion.h2>
          <motion.p 
            className={styles.shippingSubtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We make shopping with us easy and secure, with fast shipping and hassle-free returns
          </motion.p>
        </div>

        <div className={styles.shippingGrid}>
          <motion.div 
            className={styles.shippingCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.shippingIcon}>
              <FaPlane />
            </div>
            <h3>Fast Global Shipping</h3>
            <p>Free shipping on orders over $50. International delivery within 5-7 business days.</p>
          </motion.div>

          <motion.div 
            className={styles.shippingCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className={styles.shippingIcon}>
              <FaLock />
            </div>
            <h3>Secure Payment</h3>
            <p>Multiple payment options with SSL encryption for your peace of mind.</p>
          </motion.div>

          <motion.div 
            className={styles.shippingCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className={styles.shippingIcon}>
              <FaUndo />
            </div>
            <h3>Easy Returns</h3>
            <p>30-day return policy. No questions asked, we make returns simple.</p>
          </motion.div>

          <motion.div 
            className={styles.shippingCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className={styles.shippingIcon}>
              <FaMapMarkerAlt />
            </div>
            <h3>Track Your Order</h3>
            <p>Real-time tracking updates from order to delivery at your doorstep.</p>
          </motion.div>
        </div>
      </section>

      <section className={styles.newsletterSection}>
        <div className={styles.newsletterContainer}>
          <div className={styles.newsletterContent}>
            <motion.h2 
              className={styles.newsletterTitle}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Stay Inspired. Never Miss a Drop.
            </motion.h2>
            <motion.p 
              className={styles.newsletterSubtitle}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Be the first to hear about new case designs, artist collabs, and exclusive discounts.
            </motion.p>
          </div>
          <motion.form 
            className={styles.newsletterForm}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={(e) => {
              e.preventDefault();
              // Add sparkle effect
              const form = e.currentTarget;
              for (let i = 0; i < 10; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = styles.sparkle;
                sparkle.style.left = `${Math.random() * 100}%`;
                sparkle.style.top = `${Math.random() * 100}%`;
                form.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 1000);
              }
            }}
          >
            <div className={styles.newsletterInputWrapper}>
              <FaEnvelope className={styles.newsletterIcon} />
              <input 
                type="email" 
                className={styles.newsletterInput}
                placeholder="Enter your email"
                required
              />
            </div>
            <motion.button 
              className={styles.newsletterButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join the Creative Club
            </motion.button>
          </motion.form>
        </div>
      </section>

      {isBackendPost(selectedPost) && (
  <div className={styles.modalOverlay} onClick={handleCloseModal}>
    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
      <div className={styles.modalLeft}>
        <img 
          src={selectedPost.design.image_url} 
          alt={selectedPost.caption} 
          className={`${styles.postImage} ${selectedPost.design.type === 'customed rubber case' ? styles.postImagerubber : styles.postImageclear}`} 
        />
              </div>
      
      <div className={styles.modalRight}>
        <div className={styles.modalHeader}>
          <h2>{selectedPost.caption}</h2>
          <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
            </div>
        
        <div className={styles.modalBody}>
          <div className={styles.creatorInfo}>
            <div className={styles.creatorHeader}> 
              <img 
                src={selectedPost.profile_pic || "/inspiration/e66ea461e14e113f67aa0b34db419404.jpg"} 
                alt={selectedPost.user} 
                className={styles.creatorAvatar} 
              />

              <div className={styles.creatorDetails}>
                <span className={styles.creatorName}>{selectedPost.user_details.first_name} {selectedPost.user_details.last_name}</span>
                <span className={styles.creatorUsername} onClick={() => {
                  if (selectedPost.user_id === currentUserId) {
                    router.push('/newprofile');
                  } else {
                    router.push(`/someoneProfile/${selectedPost.user_id}`);
                  }
                }}>@{selectedPost.user}</span>
              </div>
                </div>
            <div className={styles.userDescription}>
              <p className={styles.userDescriptionText}>
                {selectedPost.description}
              </p>
              </div>
            </div>

          <div className={styles.postDescription}>
            <div className={styles.descriptionHeader}>
              <h3 className={styles.descriptionTitle}>Case Description</h3>
              </div>
            <p className={styles.descriptionText}>A mesmerizing blend of vibrant colors and fluid shapes that creates a sense of movement and harmony. This design captures the essence of abstract art while maintaining a modern, minimalist aesthetic. Perfect for those who appreciate contemporary art and want to make a bold statement with their phone case.

The case features a premium matte finish that enhances the colors and provides a comfortable grip. The design is printed using high-quality UV printing technology, ensuring long-lasting vibrancy and durability.</p>

            <div className={styles.descriptionTags}>
              {selectedPost.hashtag_names && selectedPost.hashtag_names.map((tag, index) => (
                <span key={index} className={styles.tag}>#{tag}</span>
              ))}
                </div>
              </div>

          <div className={styles.postInfo}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FaCalendarAlt />
            </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Posted on</span>
                <span className={styles.infoValue}>
                  {new Date(selectedPost.created_at).toLocaleDateString()}
                </span>
              </div>
                </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FaMobile />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Phone Model</span>
                <span className={styles.infoValue}>{selectedPost.design.modell}</span>
            </div>
              </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FaTag />
                </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Case Type</span>
                <span className={styles.infoValue}>{selectedPost.design.type === "customed clear case" ? "Clear Case" : 'Rubber Case'}
                </span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FaDollarSign />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Price</span>
                <span className={styles.infoValue}>${selectedPost.design.price}</span>
                </div>
              </div>
            </div>

          <div className={styles.interactionBar}>
            <button className={`${styles.interactionButton} ${isLiked ? styles.active : ''}`} onClick={() => handleLike((selectedPost as BackendPost).id)}>
            {isLiked ? <FaHeart /> : <FaRegHeart />}
              <span className={styles.interactionCount}>{selectedPost.like_count}</span>
            </button>
            <button className={`${styles.interactionButton} ${isSaved ? styles.active : ''}`} onClick={() => handleFavorite((selectedPost as BackendPost).id)}>
            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
              <span className={styles.interactionCount}>{selectedPost.favorite_count}</span>
            </button>
            <button 
              className={styles.addToCartButton}
              onClick={() => handleAddToCart(selectedPost as BackendPost)}
            >
              <FaShoppingCart />
              Add to Cart - ${selectedPost.design.price}
            </button>
              </div>

          <div className={styles.commentsSection}>
  <div className={styles.commentsHeader}>
    <h3>Comments</h3>
    <span className={styles.commentCount}>{selectedPost.comment_count}</span>
                </div>
  
  <form className={styles.commentInput} onSubmit={(e) => handleComment(e, (selectedPost as BackendPost).id)}>
    <input
      type="text"
      name="content"
      placeholder="Add a comment..."
      required
    />
    <button type="submit">Submit</button>
  </form>

<div className={styles.commentsList}>
  {selectedPost.comments && selectedPost.comments.length > 0 ? (
    selectedPost.comments.map((comment) => {
      // Get current user info from token
      const token = localStorage.getItem('token');
      const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).user_id : null;
      const isCommentOwner = currentUserId === comment.user_id;
      
      return (
        <div key={comment.id} className={styles.comment}>
          <img 
            src={comment.profile_pic || "/inspiration/e66ea461e14e113f67aa0b34db419404.jpg"} 
            alt={comment.username} 
            className={styles.commentAvatar} 
          />
          <div className={styles.commentContent}>
            <div className={styles.commentHeader}>
              <span className={styles.commentAuthor} onClick={() => {
                if (comment.user_id === currentUserId) {
                  router.push('/newprofile');
                } else {
                  router.push(`/someoneProfile/${comment.user_id}`);
                }
              }}>{comment.username}</span>
              <span className={styles.commentDate}>
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
              </div>
            <div className={styles.commentBody}>
              <p className={styles.commentText}>{comment.content}</p>
              {isCommentOwner && (
                <button 
                  className={styles.deleteCommentButton}
                  onClick={() => handleDeleteComment(comment.id, (selectedPost as BackendPost).id)}
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
    <div className={styles.noComments}>
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
    </div>
    </Layout>
  );
}
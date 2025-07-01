"use client";

import React, { useState, useEffect,useRef, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import styles from './newui.module.css';
import styles2 from '../newprofile/newprofile.module.css';

import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaComment, FaShoppingCart, FaMobile, FaTag, FaCalendarAlt, FaDollarSign, FaUpload, FaMobileAlt, FaEye, FaLock, FaShare, FaArrowRight, FaPlane, FaUndo, FaMapMarkerAlt, FaEnvelope, FaInstagram, FaTiktok, FaPinterest, FaUser, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, User, Bell, ShoppingCart } from 'lucide-react';

interface Notification {
  id: number;
  message: string;
  notification_type: string;
  created_at: string;
  is_read: boolean;
  action_user: string;
  action_user_profile_pic: string;
  relative_time: string;
  design_image_url: string;
}

interface LayoutProps {
  children: React.ReactNode;
}

interface TrackedOrderItem {
  id: number;
  name: string;
  image: string;
  price: number;
  type: string;
  modell: string;
  quantity: number;
}

interface TrackedOrder {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  status?: string;
  created_at?: string;
  address?: string;
  city?: string;
  country?: string;
  items?: TrackedOrderItem[];
  // For localStorage format (when order is nested)
  order?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    status: string;
    created_at: string;
    address: string;
    city: string;
    country: string;
    items: TrackedOrderItem[];
  };
}

// --- JWT decode utility ---
function decodeJwt(token: string) {
  if (!token) return null;
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

// Custom UI Components
interface AvatarProps {
  className?: string
  children: ReactNode
}

const Avatar = ({ className = "", children }: AvatarProps) => (
  <div className={`${styles2.avatar} ${className}`}>{children}</div>
)

interface AvatarImageProps {
  src: string
  alt: string
}

const AvatarImage = ({ src, alt }: AvatarImageProps) => (
  <img
    src={src || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"}
    alt={alt}
    className={styles2.avatarImage}
    onError={(e) => {
      const target = e.target as HTMLImageElement
      target.style.display = "none"
      const fallback = target.nextElementSibling as HTMLElement
      if (fallback) {
        fallback.style.display = "flex"
      }
    }}
  />
)

interface AvatarFallbackProps {
  className?: string
  children: ReactNode
}

const AvatarFallback = ({ className = "", children }: AvatarFallbackProps) => (
  <div className={`${styles2.avatarFallback} ${className}`} style={{ display: "none" }}>
    {children}
  </div>
)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "icon"
  className?: string
  children: ReactNode
}

const Button = ({ variant = "default", size = "default", className = "", children, ...props }: ButtonProps) => (
  <button
    className={`${styles2.button} ${styles2[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} ${styles2[`button${size.charAt(0).toUpperCase() + size.slice(1)}`]} ${className}`}
    {...props}
  >
    {children}
  </button>
)

export default function Layout({ children }: LayoutProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/${id}/read/`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) => (notification.id === id ? { ...notification, is_read: true } : notification)),
        )
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      const promises = unreadNotifications.map(notification => 
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/${notification.id}/read/`, {
          method: 'POST',
          headers: getAuthHeaders(),
        })
      );
      
      await Promise.all(promises);
      setNotifications((prev) => prev.map((notification) => ({ ...notification, is_read: true })))
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className={styles.notificationTypeIcon} />
      case "comment":
        return <MessageSquare className={styles.notificationTypeIcon} />
      case "follow":
        return <User className={styles.notificationTypeIcon} />
      case "order":
        return <ShoppingCart className={styles.notificationTypeIcon} />
      default:
        return <Bell className={styles.notificationTypeIcon} />
    }
  };

  const fetchNotifications = async () => {
    try {
      console.log('🔍 Fetching notifications...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      console.log('✅ Notifications response:', data);
      
      // The API returns {"notifications": [...]}
      const notificationsData = data.notifications || [];
      console.log('✅ Extracted notifications data:', notificationsData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
    }
  };

  const [loading, setLoading] = useState(true);
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCart, setShowCart] = useState(false);

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



  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);

  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackEmail, setTrackEmail] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null);
  const [trackError, setTrackError] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);

  const [lastOrder, setLastOrder] = useState<TrackedOrder | null>(null);

  const [orderHistory, setOrderHistory] = useState<TrackedOrder[]>([]);

  const [activeTab, setActiveTab] = useState<'cart' | 'orders'>(cartItems.length > 0 ? 'cart' : 'orders');

  const prevTokenRef = React.useRef<string | null>(null);

  // Add state for search results display
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Add state for selected post modal
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // --- MOBILE SEARCH STATE ---
  const [mobileQuery, setMobileQuery] = useState('');
  const [mobilePosts, setMobilePosts] = useState<any[]>([]);
  const [mobileUsers, setMobileUsers] = useState<any[]>([]);
  const [mobileShowSearchResults, setMobileShowSearchResults] = useState(false);
  const [mobileLoading, setMobileLoading] = useState(false);
  const [mobileError, setMobileError] = useState<string | null>(null);

  // --- MOBILE SEARCH HANDLER ---
  const handleMobileSearch = async () => {
    console.log('handleMobileSearch called with query:', mobileQuery);
    if (!mobileQuery.trim()) {
      setMobileShowSearchResults(false);
      setMobilePosts([]);
      setMobileUsers([]);
      console.log('handleMobileSearch: query empty, hiding results');
      return;
    }
    setMobileLoading(true);
    setMobileError(null);
    setMobileShowSearchResults(true);
    try {
      // Get the logged-in user ID from token
      const token = localStorage.getItem('token');
      let asUserId = '';
      if (token) {
        try {
          const decoded = decodeJwt(token);
          if (decoded && decoded.user_id) {
            asUserId = `&as_user=${decoded.user_id}`;
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
      const searchUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/search_posts/?query=${encodeURIComponent(mobileQuery.trim())}${asUserId}`;
      console.log('handleMobileSearch: fetching', searchUrl);
      const response = await fetch(searchUrl);
      const data = await response.json();
      if (response.ok) {
        setMobilePosts(data.posts || []);
        setMobileUsers(data.users || []);
        console.log('handleMobileSearch: results', data);
      } else {
        setMobileError(data.error || 'An unknown error occurred.');
        setMobilePosts([]);
        setMobileUsers([]);
        console.log('handleMobileSearch: error', data.error);
      }
    } catch (err) {
      console.error('Search error:', err);
      setMobileError('Failed to fetch search results.');
      setMobilePosts([]);
      setMobileUsers([]);
    } finally {
      setMobileLoading(false);
    }
  };

  // --- MOBILE SEARCH DROPDOWN CLOSE ON OUTSIDE CLICK ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.querySelector(`.${styles.searchContainer}`);
      const dropdown = document.querySelector(`.${styles.searchResultsDropdown}`);
      if (
        searchContainer &&
        !searchContainer.contains(event.target as Node) &&
        dropdown &&
        !dropdown.contains(event.target as Node)
      ) {
        setMobileShowSearchResults(false);
      }
    };
    if (mobileShowSearchResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileShowSearchResults]);

  // --- MOBILE SEARCH CLEAR ON EMPTY ---
  useEffect(() => {
    if (!mobileQuery.trim()) {
      setMobileShowSearchResults(false);
    }
  }, [mobileQuery]);

  useEffect(() => {
    if (showCart) {
      const storedCart = JSON.parse(localStorage.getItem("cart") || '[]');
  
      setCartItems(storedCart);
      updateCartTotals(storedCart);
      const storedLastOrder = localStorage.getItem('lastOrder');
      setLastOrder(storedLastOrder ? JSON.parse(storedLastOrder) : null);
      
      // For logged-in users, fetch from backend; for anonymous users, use localStorage
      const token = localStorage.getItem('token');
      if (token) {
        // Fetch order history from backend for logged-in users
        const fetchOrderHistory = async () => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/history/`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();            
            
            if (Array.isArray(data)) {
              setOrderHistory(data);
            } else if (Array.isArray(data.orders)) {
              setOrderHistory(data.orders);
            } else {
              setOrderHistory([]);
            }
          } catch (error) {
            console.error('Error fetching order history:', error);
            setOrderHistory([]);
          }
        };
        fetchOrderHistory();
      } else {
        // Use localStorage for anonymous users
        const storedOrderHistory = localStorage.getItem('orderHistory');
        setOrderHistory(storedOrderHistory ? JSON.parse(storedOrderHistory) : []);
      }
    }
  }, [showCart]);

  
  
  // Update quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 9) return;
  
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
  
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartTotals(updatedCart);
  };
  
  // Remove item
  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
  
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartTotals(updatedCart);
  };
  
  // Calculate total and item count
  const updateCartTotals = (items: any[]) => {
    const total = items.reduce((sum: any, item: any) => sum + item.price * item.quantity, 0);
    const count = items.reduce((sum: any, item: any) => sum + item.quantity, 0);
    setCartTotal(total);
    setCartItemCount(count);
  };

  // Count items on first load
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || '[]');
    const count = storedCart.reduce((sum: any, item: any) => sum + item.quantity, 0);
    setCartItemCount(count);
  }, []);

  // Listen for custom "cartUpdated" event
  useEffect(() => {
    const updateCountFromStorage = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart") || '[]');
      const updatedCount = updatedCart.reduce((sum: any, item: any) => sum + item.quantity, 0);
      setCartItemCount(updatedCount);
    };

    window.addEventListener("cartUpdated", updateCountFromStorage);
    window.addEventListener("storage", updateCountFromStorage); // Optional: cross-tab sync

    return () => {
      window.removeEventListener("cartUpdated", updateCountFromStorage);
      window.removeEventListener("storage", updateCountFromStorage);
    };
  }, []);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchNotifications();
    }
  }, []);

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
  };

  const cancelSelect = () => {
    setSelectedOrder(null);
  };

  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      if (section === 'section2') {
        notifications.forEach((notification) => {
          if (!notification.is_read) {
            markAsRead(notification.id);
          }
        });
      }
      setActiveSection(section);
    }
  };

  // Update handleSearch to show results
  const handleSearch = async () => {
    if (!query.trim()) {
      setShowSearchResults(false);
      setPosts([]);
      setUsers([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    setIsSearching(true);
    setShowSearchResults(true);

    try {
      // Get the logged-in user ID from token
      const token = localStorage.getItem('token');
      let asUserId = '';
      if (token) {
        try {
          const decoded = decodeJwt(token);
          if (decoded && decoded.user_id) {
            asUserId = `&as_user=${decoded.user_id}`;
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }

      const searchUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/search_posts/?query=${encodeURIComponent(query.trim())}${asUserId}`;
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts || []);
        setUsers(data.users || []);
      } else {
        setError(data.error || 'An unknown error occurred.');
        setPosts([]);
        setUsers([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch search results.');
      setPosts([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle clicking outside search results to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.querySelector(`.${styles.searchContainer}`);
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    if (showSearchResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchResults]);

  // Clear search results when query is empty
  useEffect(() => {
    if (!query.trim()) {
      setShowSearchResults(false);
    }
  }, [query]);

  const logout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      localStorage.removeItem('token');
      alert('You have been logged out.');
      window.location.href = '/login';
    }
  };

  const isActive = (path: string) => pathname === path;
  const isActive2 = (section: string) => activeSection === section;

  const toggleMenu = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [menuOpen]);

  // When cartItems/orderHistory changes, update default tab
  useEffect(() => {
    console.log('Tab switching logic - orderHistory length:', orderHistory.length, 'cartItems length:', cartItems.length);
    if (orderHistory.length > 0) {
      console.log('Setting active tab to orders because orderHistory has items');
      setActiveTab('cart');  // Prioritize orders if they exist
    } else if (cartItems.length > 0) {
      console.log('Setting active tab to cart because cartItems has items');
      setActiveTab('cart');
    } else {
      console.log('Setting active tab to orders (default)');
      setActiveTab('cart');  // Default to orders tab
    }
  }, [cartItems.length, orderHistory.length]);

  // --- Cart & Order Sync Logic ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    let userId: string | null = null;
    if (token) {
      try {
        const decoded = decodeJwt(token);
        userId = decoded && decoded.user_id ? decoded.user_id.toString() : null;
      } catch {}
    }

    // Helper: associate anonymous orders with user
    const associateAnonymousOrders = async () => {
      const anonOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      const orderIds = anonOrders.map((order: any) => ({ id: (order.order && order.order.id) || order.id }));
      if (orderIds.length > 0 && token) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/associate_orders/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ orders: orderIds }),
          });
          const result = await response.json();
          localStorage.removeItem('orderHistory');
        } catch (e) {
          console.error('Error associating orders:', e);
        }
      }
    };

    // Helper: fetch order history from backend
    const fetchOrderHistory = async () => {
      if (token) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/history/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (Array.isArray(data)) {
            setOrderHistory(data);
            console.log('Order history:', data);
          } else if (Array.isArray(data.orders)) {
            setOrderHistory(data.orders);
          } else {
            setOrderHistory([]);
          }
        } catch (error) {
          console.error('Error fetching order history:', error);
          setOrderHistory([]);
        }
      }
    };

    // --- On Login ---
    if (token && userId) {
      // Only associate anonymous orders if there was no previous token (fresh login)
      if (!prevTokenRef.current) {
        associateAnonymousOrders();
      }
      prevTokenRef.current = token;
      // Fetch user order history from backend
      fetchOrderHistory();
    } else {
      // Not logged in: use localStorage orderHistory
      const storedOrderHistory = localStorage.getItem('orderHistory');
      const parsedHistory = storedOrderHistory ? JSON.parse(storedOrderHistory) : [];
      setOrderHistory(parsedHistory);
    }

    // Listen for order placement events
    const handleOrderPlaced = (event: CustomEvent) => {
      if (event.detail?.isLoggedIn && token) {
        fetchOrderHistory();
      }
    };

    window.addEventListener('orderPlaced', handleOrderPlaced as EventListener);
    
    return () => {
      window.removeEventListener('orderPlaced', handleOrderPlaced as EventListener);
    };
  }, [isLoggedIn]);

  // Set logged in user ID from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = decodeJwt(token);
        if (decoded && decoded.user_id) {
          setLoggedInUserId(decoded.user_id);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Modal functions
  const handleCloseModal = () => {
    setSelectedPost(null);
    setIsLiked(false);
    setIsSaved(false);
  };



  const handleLike = async (postId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/like/`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.is_liked);
        if (selectedPost) {
          setSelectedPost((prev: any) => ({
            ...prev,
            like_count: data.like_count,
            is_liked: data.is_liked
          }));
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleFavorite = async (postId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/favorite/`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.is_favorited);
        if (selectedPost) {
          setSelectedPost((prev: any) => ({
            ...prev,
            favorite_count: data.favorite_count,
            is_favorited: data.is_favorited
          }));
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleAddToCart = (post: any) => {
    const cartItem = {
      id: post.design.id,
      name: post.caption,
      image: post.design.image_url,
      price: post.design.price,
      type: post.design.type,
      modell: post.design.modell,
      quantity: 1
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || '[]');
    const index = existingCart.findIndex((item: any) => item.id === cartItem.id);

    if (index > -1) {
      existingCart[index].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert('Added to cart!');
  };

  const handleComment = async (e: React.FormEvent<HTMLFormElement>, postId: number) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get('content') as string;

    if (!content.trim()) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/comment/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh comments by fetching the post again
        const postResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${postId}/`);
        if (postResponse.ok) {
          const postData = await postResponse.json();
          setSelectedPost(postData);
        }
        // Clear the form
        e.currentTarget.reset();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: number, postId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/${commentId}/delete/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        // Refresh comments by fetching the post again
        const postResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${postId}/`);
        if (postResponse.ok) {
          const postData = await postResponse.json();
          setSelectedPost(postData);
        }
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handlePostClick = async (post: any) => {
    console.log('handlePostClick called with post:', post);
    try {
      // Get the logged-in user ID from token
      const token = localStorage.getItem('token');
      let asUserId = '';
      if (token) {
        try {
          const decoded = decodeJwt(token);
          if (decoded && decoded.user_id) {
            asUserId = `?as_user=${decoded.user_id}`;
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${post.id}${asUserId}`);
      if (response.ok) {
        const postData = await response.json();
        console.log('Post data fetched:', postData);
        setSelectedPost(postData);
        setIsLiked(postData.is_liked);
        setIsSaved(postData.is_favorited);
        console.log('Modal should now be open');
      }
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  if (selectedOrder) {
    return (
      <div className={styles.orderDetails}>
        <div className={styles.card}>
          <div className={`${styles.cardImage} ${selectedOrder.type === "customed rubber case" ? styles.rubberH : ""}`}>
            <img src={selectedOrder.image_url} alt="Order design" />
          </div>
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>{selectedOrder.type}</h2>
            <h3 className={styles.cardSubtitle}>{selectedOrder.modell}</h3>
            <div className={styles.cardInfo}>
              <p><strong>First Name:</strong> {selectedOrder.first_name}</p>
              <p><strong>Last Name:</strong> {selectedOrder.last_name}</p>
              <p><strong>Email:</strong> {selectedOrder.email}</p>
              <p><strong>Phone Number:</strong> {selectedOrder.phone_number}</p>
              <p><strong>Country:</strong> {selectedOrder.country}</p>
              <p><strong>City:</strong> {selectedOrder.city}</p>
              <p><strong>Address:</strong> {selectedOrder.address}</p>
              <p><strong>Product Price:</strong> ${selectedOrder.price}</p>
              <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
              <p><strong>Total Price:</strong> ${selectedOrder.price * selectedOrder.quantity}</p>
            </div>
            <div className={styles.cardFooter}>
              <button onClick={cancelSelect} className={styles.backButton}>
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.modernHeader}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoText}>Art</span>
              <span className={styles.logoHighlight}>Case</span>
            </Link>
          </div>

          <nav className={styles.mainNav}>
            <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>
              Home
            </Link>
            <Link href="/newexplore" className={`${styles.navLink} ${pathname === '/newexplore' ? styles.active : ''}`}>
              Explore
            </Link>
            <Link href="/blog" className={`${styles.navLink} ${pathname === '/blog' ? styles.active : ''}`}>
              Blog
            </Link>
            <Link href="/pricing" className={`${styles.navLink} ${pathname === '/pricing' ? styles.active : ''}`}>
              Pricing
            </Link>
          </nav>

          <div className={styles.searchSection}>
            <div className={`${styles.searchContainer} ${styles.searchContainerDesktop}`}>
              <input
                type="text"
                placeholder="Search..."
                className={styles.modernSearch}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <button className={styles.searchButton} onClick={handleSearch}>
                <i className="fas fa-search"></i>
              </button>
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className={styles.searchResultsDropdown}>
                  {loading ? (
                    <div className={styles.searchLoading}>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Searching...</span>
                    </div>
                  ) : error ? (
                    <div className={styles.searchError}>
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>{error}</span>
                    </div>
                  ) : posts.length === 0 && users.length === 0 ? (
                    <div className={styles.searchNoResults}>
                      <i className="fas fa-search"></i>
                      <span>No results found</span>
                    </div>
                  ) : (
                    <>
                      {/* Posts Results */}
                      {posts.length > 0 && (
                        <div className={styles.searchSection}>
                          <h4 className={styles.searchSectionTitle}>Posts</h4>
                          {posts.slice(0, 5).map((post: any) => (
                            <div 
                              key={post.id} 
                              className={styles.searchResultItem}
                              onClick={() => {
                                setShowSearchResults(false);
                                setQuery('');
                                handlePostClick(post);
                              }}
                            >
                              <img src={post.design?.image_url || '/placeholder.svg'} alt={post.caption} className={`${styles.searchResultImage} ${post.design.type === "customed rubber case" ? styles.searchresultrubberimage : '' }`} />
                              <div className={styles.searchResultContent}>
                                <h5 className={styles.searchResultTitle}>{post.caption}</h5>
                                <p className={styles.searchResultSubtitle}>by @{post.user_details?.username || post.user}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Users Results */}
                      {users.length > 0 && (
                        <div className={styles.searchSection}>
                          <h4 className={styles.searchSectionTitle}>Users</h4>
                          {users.slice(0, 5).map((user: any) => (
                            <div 
                              key={user.id} 
                              className={styles.searchResultItem}
                              onClick={() => {
                                if (user.id === currentUserId) {
                                  router.push('/newprofile');
                                } else {
                                  router.push(`/someoneProfile/${user.id}`);
                                }
                              }}
                            >
                              <img src={user.profile_pic || '/placeholder.svg'} alt={user.username} className={styles.searchResultImage} />
                              <div className={styles.searchResultContent}>
                                <h5 className={styles.searchResultTitle}>{user.first_name} {user.last_name}</h5>
                                <p className={styles.searchResultSubtitle}>@{user.username}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={styles.userActions}>
            <div className={styles.primaryActions}>
                <button className={styles.actionButton} onClick={() => router.push('/newdesign')}>
                  <i className="fas fa-plus"></i>
                  <span className="d-none d-md-inline">Create</span>
                </button>
            </div>
            <div className={styles.secondaryActions}>
              <button className={styles.actionButton + ' ' + styles.cartButton} onClick={() => setShowCart(!showCart)}>
                <i className="fas fa-shopping-cart"></i>
                {cartItemCount > 0 && <span className={styles.cartBadge}>{cartItemCount}</span>}
              </button>

              {isLoggedIn ? (
                <>
                  <button className={styles.actionButton + ' ' + styles.notificationButton} onClick={() => setShowNotifications((v) => !v)}>
                    <i className="fas fa-bell"></i>
                    {unreadCount > 0 && (
                      <span className={styles.notificationBadge}>{unreadCount}</span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className={styles.notificationDropdown}>
                      <div className={styles.notificationHeader}>
                        <h3 className={styles.notificationTitle}>Notifications</h3>
                        {unreadCount > 0 && (
                          <button className={styles.markAllReadButton} onClick={markAllAsRead}>
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className={styles.notificationList}>
                        {notifications.length === 0 ? (
                          <div className={styles.emptyNotifications}>
                            <i className={`fas fa-bell ${styles.emptyNotificationIcon}`}></i>
                            <p className={styles.emptyNotificationText}>No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={
                                styles.notificationItem +
                                (!notification.is_read ? ' ' + styles.notificationUnread : '')
                              }
                              onClick={() => markAsRead(notification.id)}
                            >
                              <div className={styles.notificationContent}>
                                <div className={styles.notificationLeft}>
                                  {notification.action_user_profile_pic ? (
                                    <Avatar className={styles.notificationAvatar}>
                                      <AvatarImage src={notification.action_user_profile_pic} alt="User" />
                                      <AvatarFallback>{notification.action_user?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                  ) : notification.design_image_url ? (
                                    <Avatar className={styles.notificationAvatar}>
                                      <AvatarImage src={notification.design_image_url || "/placeholder.svg"} alt="Design" />
                                      <AvatarFallback>D</AvatarFallback>
                                    </Avatar>
                                  ) : (
                                    <div className={styles.notificationIconWrapper}>
                                      {getNotificationIcon(notification.notification_type)}
                                    </div>
                                  )}
                                </div>
                                <div className={styles.notificationRight}>
                                  <p className={styles.notificationMessage}>{notification.message}</p>
                                  <p className={styles.notificationTime}>{notification.relative_time}</p>
                                </div>
                              </div>
                              {!notification.is_read && <div className={styles.unreadDot}></div>}
                            </div>
                          ))
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className={styles.notificationFooter}>
                          <button className={styles.viewAllButton}>
                            View all notifications
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <button className={styles.actionButton} onClick={() => router.push('/newprofile')}>
                    <i className="fas fa-user"></i>
                  </button>
                </>
              ) : (
                <div className={styles.authButtons}>
                  <Link href="/login">
                    <button className={styles.loginButton}>Log In</button>
                  </Link>
                  <Link href="/register">
                    <button className={styles.signupButton}>Sign Up</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className={styles.mobileActions}>
          <button className={styles.actionButton} onClick={() => router.push('/newdesign')}>
                    <i className="fas fa-plus"></i>
                    <span className="d-none d-md-inline">Create</span>
                  </button>
                  <button className={styles.actionButton + ' ' + styles.cartButton} onClick={() => setShowCart(!showCart)}>
                    <i className="fas fa-shopping-cart"></i>
                    {cartItemCount > 0 && <span className={styles.cartBadge}>{cartItemCount}</span>}
                  </button>
            {isLoggedIn ? (
                <>

                  <button className={styles.actionButton + ' ' + styles.notificationButton} onClick={() => setShowNotifications((v) => !v)}>
                    <i className="fas fa-bell"></i>
                    {unreadCount > 0 && (
                      <span className={styles.notificationBadge}>{unreadCount}</span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className={styles.notificationDropdown}>
                      <div className={styles.notificationHeader}>
                        <h3 className={styles.notificationTitle}>Notifications</h3>
                        {unreadCount > 0 && (
                          <button className={styles.markAllReadButton} onClick={markAllAsRead}>
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className={styles.notificationList}>
                        {notifications.length === 0 ? (
                          <div className={styles.emptyNotifications}>
                            <i className={`fas fa-bell ${styles.emptyNotificationIcon}`}></i>
                            <p className={styles.emptyNotificationText}>No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={
                                styles.notificationItem +
                                (!notification.is_read ? ' ' + styles.notificationUnread : '')
                              }
                              onClick={() => markAsRead(notification.id)}
                            >
                              <div className={styles.notificationContent}>
                                <div className={styles.notificationLeft}>
                                  {notification.action_user_profile_pic ? (
                                    <Avatar className={styles.notificationAvatar}>
                                      <AvatarImage src={notification.action_user_profile_pic} alt="User" />
                                      <AvatarFallback>{notification.action_user?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                  ) : notification.design_image_url ? (
                                    <Avatar className={styles.notificationAvatar}>
                                      <AvatarImage src={notification.design_image_url || "/placeholder.svg"} alt="Design" />
                                      <AvatarFallback>D</AvatarFallback>
                                    </Avatar>
                                  ) : (
                                    <div className={styles.notificationIconWrapper}>
                                      {getNotificationIcon(notification.notification_type)}
                                    </div>
                                  )}
                                </div>
                                <div className={styles.notificationRight}>
                                  <p className={styles.notificationMessage}>{notification.message}</p>
                                  <p className={styles.notificationTime}>{notification.relative_time}</p>
                                </div>
                              </div>
                              {!notification.is_read && <div className={styles.unreadDot}></div>}
                            </div>
                          ))
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className={styles.notificationFooter}>
                          <button className={styles.viewAllButton}>
                            View all notifications
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <button className={styles.actionButton} onClick={() => router.push('/newprofile')}>
                    <i className="fas fa-user"></i>
                  </button>
                </>
              ) : (
                <div className={styles.authButtons}>
                  <Link href="/login">
                    <button className={styles.signupButton}>Log In</button>
                  </Link>
                </div>
              )}
            <button 
              className={styles.mobileMenuButton} 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle mobile menu"
            >
              <i className="fas fa-bars"></i>
            </button>
            {menuOpen && (
              <div className={styles.mobileMenuDropdown}>
                <Link 
                  href="/" 
                  className={`${styles.mobileMenuItem} ${pathname === '/' ? styles.mobileMenuItemActive : ''}`} 
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="fas fa-home"></i>
                  Home
                </Link>
                <Link 
                  href="/newexplore" 
                  className={`${styles.mobileMenuItem} ${pathname === '/newexplore' ? styles.mobileMenuItemActive : ''}`} 
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="fas fa-compass"></i>
                  Explore
                </Link>
                <Link 
                  href="/blog" 
                  className={`${styles.mobileMenuItem} ${pathname === '/blog' ? styles.mobileMenuItemActive : ''}`} 
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="fas fa-blog"></i>
                  Blog
                </Link>
                <Link 
                  href="/pricing" 
                  className={`${styles.mobileMenuItem} ${pathname === '/pricing' ? styles.mobileMenuItemActive : ''}`} 
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="fas fa-tag"></i>
                  Pricing
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className={styles.mobileSearch}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search..."
            className={styles.modernSearch}
            value={mobileQuery}
            onChange={(e) => { console.log('setMobileQuery:', e.target.value); setMobileQuery(e.target.value); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleMobileSearch();
            }}
          />
          <button className={styles.searchButton} onClick={handleMobileSearch}>
            <i className="fas fa-search"></i>
          </button>
          {/* Mobile Search Results Dropdown uses the desktop dropdown style for both desktop and mobile */}
          {mobileShowSearchResults && (
            <div className={styles.searchResultsDropdown}>
              {mobileLoading ? (
                <div className={styles.searchLoading}>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Searching...</span>
                </div>
              ) : mobileError ? (
                <div className={styles.searchError}>
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>{mobileError}</span>
                </div>
              ) : mobilePosts.length === 0 && mobileUsers.length === 0 ? (
                <div className={styles.searchNoResults}>
                  <i className="fas fa-search"></i>
                  <span>No results found</span>
                </div>
              ) : (
                <>
                  {/* Posts Results */}
                  {mobilePosts.length > 0 && (
                    <div className={styles.mobilesearchSection}>
                      <h4 className={styles.searchSectionTitle}>Posts</h4>
                      {mobilePosts.slice(0, 5).map((post: any) => (
                        <div 
                          key={post.id} 
                          className={styles.searchResultItem}
                          onClick={async (e) => {
                            e.stopPropagation();
                            await handlePostClick(post);
                            setMobileShowSearchResults(false);

                          }}
                        >
                          <img src={post.design?.image_url || '/placeholder.svg'} alt={post.caption} className={`${styles.searchResultImage} ${post.design.type === "customed rubber case" ? styles.searchresultrubberimage : '' }`} />
                          <div className={styles.searchResultContent}>
                            <h5 className={styles.searchResultTitle}>{post.caption}</h5>
                            <p className={styles.searchResultSubtitle}>by @{post.user_details?.username || post.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Users Results */}
                  {mobileUsers.length > 0 && (
                    <div className={styles.mobilesearchSection}>
                      <h4 className={styles.searchSectionTitle}>Users</h4>
                      {mobileUsers.slice(0, 5).map((user: any) => (
                        <div 
                          key={user.id} 
                          className={styles.searchResultItem}
                          onClick={() => {
                            if (user.id === currentUserId) {
                              router.push('/newprofile');
                            } else {
                              router.push(`/someoneProfile/${user.id}`);
                            }
                          }}
                        >
                          <img src={user.profile_pic || '/placeholder.svg'} alt={user.username} className={styles.searchResultImage} />
                          <div className={styles.searchResultContent}>
                            <h5 className={styles.searchResultTitle}>{user.first_name} {user.last_name}</h5>
                            <p className={styles.searchResultSubtitle}>@{user.username}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`${styles.cartSidebar} ${showCart ? styles.cartSidebarOpen : ""}`} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div className={styles.cartHeader} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className={styles.cartTitle}>Shopping Cart</h2>
          <button
            className={styles.cartCloseButton}
            onClick={() => setShowCart(false)}
          >
            <i className={`fas fa-times ${styles.cartCloseIcon}`}></i>
          </button>
        </div>
        {/* Tab Switcher Row */}
        <div className={styles.tabSwitcher}>
          <button
            onClick={() => setActiveTab('cart')}
            className={`${styles.tabButton} ${activeTab === 'cart' ? styles.tabButtonActive : styles.tabButtonInactive}`}
          >
            Cart
            {cartItems.length > 0 && (
              <span className={styles.tabBadge}>{cartItems.length}</span>
            )}
          </button>
          {isLoggedIn && (
  <button
    onClick={() => setActiveTab('orders')}
    className={`${styles.tabButton} ${activeTab === 'orders' ? styles.tabButtonActive : styles.tabButtonInactive}`}
  >
    Orders
    {orderHistory.length > 0 && (
      <span className={styles.tabBadge}>{orderHistory.length}</span>
    )}
  </button>
)}
        </div>
        <div className={styles.cartContentContainer}>
          {/* Tab content switcher */}
          {activeTab === 'orders' && (
            <div className={styles.orderHistoryContainer}>
              <h3 className={styles.orderHistoryTitle}>Order History</h3>
              
              {orderHistory.length === 0 ? (
                <div className={styles.orderHistoryEmpty}>No previous orders found.</div>
              ) : (
                <div className={styles.orderHistoryList}>
                  {orderHistory.slice().reverse().map((order: any, index: number) => {
                    // Backend data is clean and flat, localStorage data might be nested
                    const orderId = order.id || order.order?.id;
                    const orderStatus = order.status || order.order?.status || 'pending';
                    const orderCreatedAt = order.created_at || order.order?.created_at;
                    const orderFirstName = order.first_name || order.order?.first_name;
                    const orderLastName = order.last_name || order.order?.last_name;
                    const orderEmail = order.email || order.order?.email;
                    const orderAddress = order.address || order.order?.address;
                    const orderCity = order.city || order.order?.city;
                    const orderCountry = order.country || order.order?.country;
                    
                    // Items are always in the same structure from backend
                    const orderItems = order.items || [];
                    
                    return (
                      <div key={orderId} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                          <div className={styles.orderId}>Order #{orderId} <span className={styles.orderStatus}>({orderStatus})</span></div>
                          <div className={styles.orderDate}>{orderCreatedAt ? new Date(orderCreatedAt).toLocaleString() : ''}</div>
                        </div>
                        <div className={styles.orderItems}>
                          {orderItems && Array.isArray(orderItems) && orderItems.length > 0 ? (
                            orderItems.map((item: any, index: number) => (
                              <div key={item.id || index} className={styles.orderItem}>
                                <img src={item.image} alt={item.name} className={styles.orderItemImage} />
                                <div className={styles.orderItemDetails}>
                                  <span className={styles.orderItemName}>{item.name}</span>
                                  <span className={styles.orderItemModel}>{item.modell}</span>
                                  <span className={styles.orderItemQuantity}>x{item.quantity}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <span className={styles.orderHistoryEmpty}>
                              {orderItems ? 'No items' : 'Order details not available'}
                            </span>
                          )}
                        </div>
                        <div className={styles.orderInfo}>
                          <span><span className={styles.orderInfoBold}>Name:</span> {orderFirstName || 'N/A'} {orderLastName || ''}</span> &nbsp;|&nbsp; <span><span className={styles.orderInfoBold}>Email:</span> {orderEmail || 'N/A'}</span>
                        </div>
                        <div className={styles.orderInfo}>
                          <span><span className={styles.orderInfoBold}>Shipping:</span> {orderAddress || 'N/A'}, {orderCity || 'N/A'}, {orderCountry || 'N/A'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {activeTab === 'cart' && cartItems.length > 0 && (
            <div className={styles.cartItems}>
              <h4 className={styles.cartItemsTitle}>Current Cart</h4>
              <div className={styles.cartItemsList}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.cartItemImage}>
                      <img src={item.image} alt={item.title} />
                      <span className={styles.cartItemBadge}>
                        {item.type === 'customed clear case' ? 'Clear' : 'Rubber'}
                      </span>
                    </div>
                    <div className={styles.cartItemDetails}>
                      <h4 className={styles.cartItemTitle}>{item.title}</h4>
                      <p className={styles.cartItemModel}>{item.modell}</p>
                      <p className={styles.cartItemPrice}>${item.price}</p>
                      <div className={styles.cartItemActions}>
                        <div className={styles.quantityControls}>
                          <button
                            className={`${styles.quantityButton} ${item.quantity <= 1 ? styles.quantityButtonDisabled : ''}`}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className={styles.quantity}>{item.quantity}</span>
                          <button
                            className={`${styles.quantityButton} ${item.quantity >= 9 ? styles.quantityButtonDisabled : ''}`}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= 9}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        <button
                          className={styles.removeButton}
                          onClick={() => removeItem(item.id)}
                        >
                          <i className={`fas fa-trash ${styles.removeIcon}`}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.cartFooter}>
                <div className={styles.cartTotal}>
                  <span className={styles.cartTotalLabel}>Total:</span>
                  <span className={styles.cartTotalAmount}>${cartTotal.toFixed(2)}</span>
                </div>
                <button className={styles.checkoutButton} onClick={() => router.push('/newordernow')}>
                  Proceed to Checkout
                </button>
                <button className={styles.continueShoppingButton} onClick={() => setShowCart(false)}>
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
          {/* Order Tracking UI: only show if cart is empty and no last order and on Cart tab */}
          {activeTab === 'cart' && cartItems.length === 0 && !lastOrder && (
            <div className={styles.orderTrackingContainer}>
              <h4 className={styles.orderTrackingTitle}>Track Your Order</h4>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setTrackError('');
                  setTrackedOrder(null);
                  setTrackLoading(true);
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order_lookup/`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ order_id: trackOrderId, email: trackEmail }),
                    });
                    if (!res.ok) {
                      const data = await res.json();
                      setTrackError(data.error || 'Order not found.');
                      setTrackLoading(false);
                      return;
                    }
                    const data = await res.json();
                    setTrackedOrder(data);
                  } catch (e) {
                    setTrackError('An error occurred.');
                  } finally {
                    setTrackLoading(false);
                  }
                }}
                className={styles.orderTrackingForm}
              >
                <input
                  type="text"
                  placeholder="Order Number"
                  value={trackOrderId}
                  onChange={e => setTrackOrderId(e.target.value)}
                  className={styles.orderTrackingInput}
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={trackEmail}
                  onChange={e => setTrackEmail(e.target.value)}
                  className={styles.orderTrackingInput}
                  required
                />
                <button type="submit" className={styles.orderTrackingButton} disabled={trackLoading}>
                  {trackLoading ? 'Searching...' : 'Find Order'}
                </button>
              </form>
              {trackError && <div className={styles.orderTrackingError}>{trackError}</div>}
              {trackedOrder && (
                <div className={styles.orderTrackingResult}>
                  <h5>Order #{trackedOrder.id}</h5>
                  <p><span className={styles.orderInfoBold}>Name:</span> {trackedOrder.first_name} {trackedOrder.last_name}</p>
                  <p><span className={styles.orderInfoBold}>Email:</span> {trackedOrder.email}</p>
                  <p><span className={styles.orderInfoBold}>Status:</span> {trackedOrder.status}</p>
                  <p><span className={styles.orderInfoBold}>Placed:</span> {trackedOrder.created_at ? new Date(trackedOrder.created_at).toLocaleString() : 'N/A'}</p>
                  <p><span className={styles.orderInfoBold}>Shipping:</span> {trackedOrder.address}, {trackedOrder.city}, {trackedOrder.country}</p>
                  <h6>Items:</h6>
                  <ul>
                    {trackedOrder.items && trackedOrder.items.map((item: any) => (
                      <li key={item.id}>
                        <img src={item.image} alt={item.name} />
                        <span className={styles.orderInfoBold}>{item.name}</span> ({item.type}) x {item.quantity} - ${item.price}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {showCart && <div className={styles.cartOverlay} onClick={() => setShowCart(false)} />}

      <main className={styles.mainContent}>
        {children}
      </main>

      <motion.footer 
        className={styles.footer}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.footerContainer}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.footerLogo}>
              <span className={styles.footerLogoText}>Art</span>
              <span className={styles.footerLogoHighlight}>Case</span>
            </Link>
            <p className={styles.footerDescription}>
              Turn creativity into something you can hold. Custom phone cases made by artists and you.
            </p>
            <div className={styles.socialIcons}>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialIcon}
                whileHover={{ scale: 1.1, color: '#38cbbb' }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FaInstagram />
              </motion.a>
              <motion.a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialIcon}
                whileHover={{ scale: 1.1, color: '#38cbbb' }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FaTiktok />
              </motion.a>
              <motion.a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialIcon}
                whileHover={{ scale: 1.1, color: '#38cbbb' }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FaPinterest />
              </motion.a>
            </div>
          </div>

          <div className={styles.footerLinks}>
            <h3 className={styles.footerTitle}>Quick Links</h3>
            <ul className={styles.footerList}>
              <li><Link href="/" className={styles.footerLink}>Home</Link></li>
              <li><Link href="/shop" className={styles.footerLink}>Shop All Designs</Link></li>
              <li><Link href="/customize" className={styles.footerLink}>Customize Your Case</Link></li>
              <li><Link href="/artists" className={styles.footerLink}>For Artists</Link></li>
              <li><Link href="/contact" className={styles.footerLink}>Contact Us</Link></li>
            </ul>
          </div>

          <div className={styles.footerLinks}>
            <h3 className={styles.footerTitle}>Customer Service</h3>
            <ul className={styles.footerList}>
              <li><Link href="/shipping" className={styles.footerLink}>Shipping Info</Link></li>
              <li><Link href="/returns" className={styles.footerLink}>Returns & Refunds</Link></li>
              <li><Link href="/track" className={styles.footerLink}>Track Order</Link></li>
              <li><Link href="/faq" className={styles.footerLink}>FAQ</Link></li>
              <li><Link href="/terms" className={styles.footerLink}>Terms & Privacy</Link></li>
            </ul>
          </div>

          <div className={styles.footerNewsletter}>
            <h3 className={styles.footerTitle}>Stay Inspired</h3>
            <p className={styles.newsletterText}>Get updates, offers, and inspiration.</p>
            <form className={styles.footerForm} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.footerInputWrapper}>
                <FaEnvelope className={styles.footerInputIcon} />
                <input 
                  type="email" 
                  placeholder="Enter your email…" 
                  className={styles.footerInput}
                  required
                />
              </div>
              <motion.button 
                className={styles.footerButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>© {new Date().getFullYear()} ArtCase. All rights reserved.</p>
        </div>
      </motion.footer>


      {selectedPost && (
  <div className={styles.modalOverlay} onClick={handleCloseModal}>
    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalLeft} style={{ position: 'relative' }}>
        {/* Delete Post button: top left, only for post owner */}

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
                <span className={styles.creatorUsername}>@{selectedPost.user}</span>
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
              {selectedPost.hashtag_names && selectedPost.hashtag_names.map((tag: string, index: number) => (
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
            <button className={`${styles.interactionButton} ${isLiked ? styles.active : ''}`} onClick={() => handleLike(selectedPost.id)}>
            {isLiked ? <FaHeart /> : <FaRegHeart />}
              <span className={styles.interactionCount}>{selectedPost.like_count}</span>
            </button>
            <button className={`${styles.interactionButton} ${isSaved ? styles.active : ''}`} onClick={() => handleFavorite(selectedPost.id)}>
            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
              <span className={styles.interactionCount}>{selectedPost.favorite_count}</span>
            </button>
            <button 
              className={styles.addToCartButton}
              onClick={() => handleAddToCart(selectedPost)}
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
  
  <form className={styles.commentInput} onSubmit={(e) => handleComment(e, selectedPost.id)}>
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
    selectedPost.comments.map((comment: any) => {
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
              <span className={styles.commentAuthor}>{comment.username}</span>
              <span className={styles.commentDate}>
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
                </div>
            <div className={styles.commentBody}>
              <p className={styles.commentText}>{comment.content}</p>
              {isCommentOwner && (
                <button 
                  className={styles.deleteCommentButton}
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
  );
} 
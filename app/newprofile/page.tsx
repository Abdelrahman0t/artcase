"use client"

import React from "react"

import { useState, type ReactNode, type ButtonHTMLAttributes, useEffect } from "react"
import {
  Heart,
  Bookmark,
  Share2,
  Edit3,
  LogOut,
  Palette,
  MessageSquare,
  User,
  Settings,
  Bell,
  ShoppingCart,
  Grid3X3,
  Phone,
  Smartphone,
  X,
  Trash2,
  Plus,
  Minus,
  Grid,
  List
} from "lucide-react"
import styles from "./newprofile.module.css"
import styles2 from "../newui/newui.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaShoppingCart, FaShareAlt, FaTrash, FaArrowLeft, FaCalendarAlt, FaMobile, FaTag, FaDollarSign, FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import styles1 from '../newui/newui.module.css';
import { useToast } from "../utils/ToastContext";
// Types for API data
interface UserData {
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
}

interface Design {
  id: number;
  image_url: string;
  modell: string;
  type: string;
  price: string;
  theclass: string;
  created_at: string;
  stock: string;
  color1?: string;
  color2?: string;
  color3?: string;
  user?: number;
}

interface Post {
  id: number;
  caption: string;
  description: string;
  created_at: string;
  user: string;
  user_id: number;
  first_name: string;
  last_name: string;
  profile_pic: string;
  design: {
    id: number;
    image_url: string;
    type: string;
    stock: string;
    modell: string;
    price: string;
  };
  like_count: number;
  comment_count: number;
  favorite_count: number;
  is_liked: boolean;
  is_favorited: boolean;
}

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

interface CartItem {
  id: number;
  title: string;
  type: string;
  image: string;
  price: number;
  quantity: number;
  model: string;
}

interface LikedPost {
  id: number;
  caption: string;
  description: string;
  created_at: string;
  user: string;
  user_id: number;
  first_name: string;
  last_name: string;
  profile_pic: string;
  design: {
    id: number;
    image_url: string;
    type: string;
    stock: string;
    modell: string;
    price: string;
  };
  like_count: number;
  comment_count: number;
  favorite_count: number;
  is_liked: boolean;
  is_favorited: boolean;
}

interface SavedPost {
  id: number;
  caption: string;
  description: string;
  created_at: string;
  user: string;
  user_id: number;
  first_name: string;
  last_name: string;
  profile_pic: string;
  design: {
    id: number;
    image_url: string;
    type: string;
    stock: string;
    modell: string;
    price: string;
  };
  like_count: number;
  comment_count: number;
  favorite_count: number;
  is_liked: boolean;
  is_favorited: boolean;
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

// Custom UI Components
interface AvatarProps {
  className?: string
  children: ReactNode
}

const Avatar = ({ className = "", children }: AvatarProps) => (
  <div className={`${styles.avatar} ${className}`}>{children}</div>
)

interface AvatarImageProps {
  src: string
  alt: string
}

const AvatarImage = ({ src, alt }: AvatarImageProps) => (
  <img
    src={src || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"}
    alt={alt}
    className={styles.avatarImage}
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
  <div className={`${styles.avatarFallback} ${className}`} style={{ display: "none" }}>
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
    className={`${styles.button} ${styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} ${styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`]} ${className}`}
    {...props}
  >
    {children}
  </button>
)

interface CardProps {
  className?: string
  children: ReactNode
  onClick?: () => void
}

const Card = ({ className = "", children, onClick }: CardProps) => (
  <div className={`${styles.card} ${className}`} onClick={onClick}>
    {children}
  </div>
)

const CardHeader = ({ className = "", children }: { className?: string; children: ReactNode }) => (
  <div className={`${styles.cardHeader} ${className}`}>{children}</div>
)

const CardContent = ({ className = "", children }: { className?: string; children: ReactNode }) => (
  <div className={`${styles.cardContent} ${className}`}>{children}</div>
)

const CardTitle = ({ className = "", children }: { className?: string; children: ReactNode }) => (
  <h3 className={`${styles.cardTitle} ${className}`}>{children}</h3>
)

const CardDescription = ({ children }: { children: ReactNode }) => <p className={styles.cardDescription}>{children}</p>

interface BadgeProps {
  variant?: "default" | "secondary"
  className?: string
  children: ReactNode
}

const Badge = ({ variant = "default", className = "", children }: BadgeProps) => (
  <span
    className={`${styles.badge} ${styles[`badge${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} ${className}`}
  >
    {children}
  </span>
)

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
  children: ReactNode
}

const Tabs = ({ value, onValueChange, className = "", children }: TabsProps) => (
  <div className={`${styles.tabs} ${className}`} data-value={value}>
    {children}
  </div>
)

const TabsList = ({ className = "", children }: { className?: string; children: ReactNode }) => (
  <div className={`${styles.tabsList} ${className}`}>{children}</div>
)

interface TabsTriggerProps {
  value: string
  className?: string
  children: ReactNode
}

const TabsTrigger = ({ value, className = "", children }: TabsTriggerProps) => {
  const handleClick = () => {
    // Dispatch custom event for tab change
    const event = new CustomEvent("tabChange", { detail: value })
    document.dispatchEvent(event)
  }

  return (
    <button className={`${styles.tabsTrigger} ${className}`} onClick={handleClick} data-value={value}>
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  className?: string
  children: ReactNode
}

const TabsContent = ({ value, className = "", children }: TabsContentProps) => (
  <div className={`${styles.tabsContent} ${className}`} data-tab={value}>
    {children}
  </div>
)

interface DropdownMenuProps {
  children: ReactNode
}

const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.dropdownMenu} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      {children}
    </div>
  )
}

const DropdownMenuTrigger = ({ children, asChild }: { children: ReactNode; asChild?: boolean }) => (
  <div className={styles.dropdownTrigger}>{children}</div>
)

interface DropdownMenuContentProps {
  className?: string
  align?: "start" | "end"
  forceMount?: boolean
  children: ReactNode
}

const DropdownMenuContent = ({ className = "", align = "start", children }: DropdownMenuContentProps) => (
  <div
    className={`${styles.dropdownContent} ${styles[`dropdownAlign${align.charAt(0).toUpperCase() + align.slice(1)}`]} ${className}`}
  >
    {children}
  </div>
)

const DropdownMenuLabel = ({ className = "", children }: { className?: string; children: ReactNode }) => (
  <div className={`${styles.dropdownLabel} ${className}`}>{children}</div>
)

const DropdownMenuItem = ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
  <div className={styles.dropdownItem} onClick={onClick}>
    {children}
  </div>
)

const DropdownMenuSeparator = () => <div className={styles.dropdownSeparator} />

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

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("designs")
  const { showToast } = useToast();
  // User data state
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userDesigns, setUserDesigns] = useState<Design[]>([])
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [userLikes, setUserLikes] = useState<LikedPost[]>([])
  const [userSaves, setUserSaves] = useState<SavedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [designsFilter, setDesignsFilter] = useState('recent')
  const [postsFilter, setPostsFilter] = useState('recent')
  const [likesFilter, setLikesFilter] = useState('recent')
  const [savesFilter, setSavesFilter] = useState('recent')

  // View mode state - default to detailed for posts, simple for likes/saves
  const [viewMode, setViewMode] = useState("detailed")

  // UI states
  const [showNotifications, setShowNotifications] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Sidebar states - matching newui layout exactly
  const [cartTotal, setCartTotal] = useState(0)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [activeSidebarTab, setActiveSidebarTab] = useState<'cart' | 'orders'>(cartItems.length > 0 ? 'cart' : 'orders')
  const [orderHistory, setOrderHistory] = useState<TrackedOrder[]>([])
  const [lastOrder, setLastOrder] = useState<TrackedOrder | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<TrackedOrder | null>(null)
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

  // New states for design modal
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [showDesignModal, setShowDesignModal] = useState(false);

  // Add logic to get loggedInUserId from token
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setLoggedInUserId(payload.user_id);
      } catch {}
    }
  }, []);

  // --- Add at the top-level of the Dashboard component ---
  const [deletingDesignId, setDeletingDesignId] = useState<number | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  // Reusable delete design handler
  const handleDeleteDesign = async (designId: number) => {
    if (!confirm('Are you sure you want to delete this design?')) return;
    setDeletingDesignId(designId);
    setDeleteMessage(null);
    try {
      const token = localStorage.getItem('token');
      // Use the correct backend endpoint for deleting a design
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/designs/${designId}/delete/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setUserDesigns((prev: Design[]) => prev.filter((d: Design) => d.id !== designId));
        setShowDesignModal(false);
        setDeleteMessage('Design deleted!');
        setTimeout(() => {
          if (typeof router !== 'undefined' && typeof router.refresh === 'function') {
            router.refresh();
          } else {
            window.location.reload();
          }
        }, 500);
      } else {
        setDeleteMessage('Failed to delete design.');
      }
    } catch (e) {
      setDeleteMessage('Error deleting design.');
    } finally {
      setDeletingDesignId(null);
      setTimeout(() => setDeleteMessage(null), 2000);
    }
  };

  // API Functions
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchUserData = async () => {
    try {
      console.log('🔍 Fetching user data...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      console.log('✅ User data response:', data);
      
      // The backend returns: id, username, email, first_name, last_name, profile_pic
      // But we need more data, so let's also fetch from /api/me/ for additional info
      const meResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me/`, {
        headers: getAuthHeaders(),
      });
      
      if (meResponse.ok) {
        const meData = await meResponse.json();
        console.log('✅ Me data response:', meData);
        
        // Combine the data
        const completeUserData = {
          ...data,
          username: meData.username || data.username,
          // Add any additional fields from me endpoint
        };
        
        console.log('✅ Complete user data:', completeUserData);
        setUserData(completeUserData);
      } else {
        console.log('⚠️ Me endpoint failed, using profile data only');
        setUserData(data);
      }
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      setError('Failed to load user data');
    }
  };

  const fetchUserDesigns = async () => {
    try {
      console.log('🔍 Fetching user designs...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-designs/`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user designs');
      }
      
      const data = await response.json();
      console.log('✅ User designs response:', data);
      setUserDesigns(data.designs || []);
    } catch (error) {
      console.error('❌ Error fetching user designs:', error);
      setError('Failed to load designs');
    }
  };

  const fetchUserPosts = async () => {
    try {
      console.log('🔍 Fetching user posts...');
      // Use the correct endpoint for user posts
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-posts/`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user posts');
      }
      
      const data = await response.json();
      console.log('✅ User posts response:', data);
      console.log('✅ Number of user posts found:', data.length);
      setUserPosts(data);
    } catch (error) {
      console.error('❌ Error fetching user posts:', error);
      setError('Failed to load posts');
    }
  };

  const fetchUserLikes = async () => {
    try {
      console.log('🔍 Fetching user liked posts...');
      // Use the new endpoint for liked posts
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/liked-posts/`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user liked posts');
      }

      const data = await response.json();
      console.log('✅ User liked posts response:', data);

      // The API returns {"liked_posts": [...]}
      const likedPostsData = data.liked_posts || [];
      console.log('✅ Extracted liked posts data:', likedPostsData);
      console.log('✅ Number of liked posts:', likedPostsData.length);
      setUserLikes(likedPostsData);
    } catch (error) {
      console.error('❌ Error fetching user liked posts:', error);
      setError('Failed to load liked posts');
      setUserLikes([]); // fallback to empty array on error
    }
  };

  const fetchUserSaves = async () => {
    try {
      console.log('🔍 Fetching user favorited posts...');
      // Use the new endpoint for favorited posts
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/favorited-posts/`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user favorited posts');
      }
      
      const data = await response.json();
      console.log('✅ User favorited posts response:', data);
      
      // The API returns {"favorited_posts": [...]}
      const favoritedPostsData = data.favorited_posts || [];
      console.log('✅ Extracted favorited posts data:', favoritedPostsData);
      console.log('✅ Number of favorited posts:', favoritedPostsData.length);
      setUserSaves(favoritedPostsData);
    } catch (error) {
      console.error('❌ Error fetching user favorited posts:', error);
      setError('Failed to load favorited posts');
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

  const fetchCart = async () => {
    try {
      console.log('🔍 Fetching cart...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/view/`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const data = await response.json();
      console.log('✅ Cart response:', data);
      setCartItems(data);
    } catch (error) {
      console.error('❌ Error fetching cart:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      console.log('🚀 Starting to load all data...');
      setLoading(true);
      try {
        await fetchUserData();
        await Promise.all([
          fetchUserDesigns(),
          fetchUserLikes(),
          fetchUserSaves(),
          fetchNotifications(),
          fetchCart()
        ]);
        console.log('✅ All data loaded successfully');
      } catch (error) {
        console.error('❌ Error loading data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
        console.log('🏁 Data loading completed');
      }
    };

    loadData();
  }, []);

  // Fetch user posts after user data is loaded
  useEffect(() => {
    if (userData) {
      console.log('👤 User data available, fetching posts for user ID:', userData.id);
      fetchUserPosts();
    }
  }, [userData]);

  // User stats calculated from real data
  const userStats = {
    designs: userDesigns.length,
    posts: userPosts.length,
    likes: userLikes.length,
    saves: userSaves.length,
  }

  console.log('📊 Current user stats:', userStats);
  console.log('📝 Current user posts count:', userPosts.length);
  console.log('❤️ Current user liked posts count:', userLikes.length);
  console.log('🔖 Current user favorited posts count:', userSaves.length);
  console.log('🎯 Active tab:', activeTab);
  console.log('📝 Current user posts data:', userPosts);
  console.log('❤️ User liked posts data:', userLikes);
  console.log('🔖 User favorited posts data:', userSaves);

  // Filtered data logic
  const filteredDesigns = userDesigns.filter(d => {
    if (designsFilter === 'recent') return true;
    return d.type.toLowerCase().includes(designsFilter);
  });

  const filteredPosts = React.useMemo(() => {
    let posts = userPosts;
    if (postsFilter === 'rubber' || postsFilter === 'clear') {
      posts = posts.filter(p => p.design.type.toLowerCase().includes(postsFilter));
    }
    if (postsFilter === 'most_liked') {
      posts = [...posts].sort((a, b) => b.like_count - a.like_count);
    } else if (postsFilter === 'most_commented') {
      posts = [...posts].sort((a, b) => b.comment_count - a.comment_count);
    }
    console.log('📝 Filtered posts:', posts.length, 'with filter:', postsFilter);
    return posts;
  }, [userPosts, postsFilter]);

  const filteredLikes = Array.isArray(userLikes)
    ? userLikes.filter(p => {
        if (likesFilter === 'recent') return true;
        return p.design.type.toLowerCase().includes(likesFilter);
      })
    : [];

  const filteredSaves = Array.isArray(userSaves)
    ? userSaves.filter(p => {
        if (savesFilter === 'recent') return true;
        return p.design.type.toLowerCase().includes(savesFilter);
      })
    : [];

  console.log('🎨 Filtered designs:', filteredDesigns.length);
  console.log('❤️ Filtered likes:', filteredLikes.length);
  console.log('🔖 Filtered saves:', filteredSaves.length);

  // Helper functions
  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.is_read).length
    : 0;

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
  }

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
  }

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
  }

  // Cart helper functions
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 9) return;
  
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
  
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartTotals(updatedCart);
  };
  
  // Remove item - matching newui layout
  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
  
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartTotals(updatedCart);
  };

  // Calculate total and item count - matching newui layout
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

  const handleCheckout = () => {
    // Redirect to checkout page or open checkout modal
    window.location.href = '/newordernow';
  };

  // Close cart when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest(`.${styles2.cartSidebar}`) && !target.closest(`.${styles.cartButton}`)) {
        setShowCart(false)
      }
    }

    if (showCart && typeof window !== 'undefined') {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showCart])

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    
    // Set default view mode based on tab
    if (value === "posts") {
      setViewMode("detailed") // Posts tab defaults to detailed view
    } else if (value === "likes" || value === "saves") {
      setViewMode("simple") // Likes and saves tabs default to simple view
    }
  }

  // Set up event listeners
  useEffect(() => {
    const handleTabChangeEvent = (e: CustomEvent) => {
      handleTabChange(e.detail)
    }

    if (typeof window !== 'undefined') {
      document.addEventListener("tabChange", handleTabChangeEvent as EventListener)
      return () => document.removeEventListener("tabChange", handleTabChangeEvent as EventListener)
    }
  }, [])

  // Close notifications when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest(`.${styles.notificationWrapper}`)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications && typeof window !== 'undefined') {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showNotifications])

  // Cart management useEffect - matching newui layout
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

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
  };

  const cancelSelect = () => {
    setSelectedOrder(null);
  };

  // --- Selected Post Modal State and Handlers (from newexplore) ---
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    console.log("post data : ",post);
    
    setIsLiked(post.is_liked);
    setIsSaved(post.is_favorited);
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
      showToast('Please log in to favorite posts', "error");
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
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost((prev: any) => prev ? { ...prev, favorite_count: data.favorite_count, is_favorited: data.is_favorited } : null);
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

  const handleAddToCart = (post: any) => {
    if (post.design.stock === 'Out of Stock') {
        showToast("Sorry, this item is currently out of stock and cannot be added to cart.", "error");
      return;
    }
    if (post.stock === 'Out of Stock') {
      showToast("Sorry, this item is currently out of stock and cannot be added to cart.", "error");
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = cart.some((item: any) => item.id === post.design.id);

    if (!exists) {
      cart.push({
        id: post.design.id,
        image: post.design.image_url,
        title: post.caption,
        modell: post.design.modell,
        type: post.design.type,
        price: Number(post.design.price),
        quantity: 1,
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      showToast('Added to cart!', "success");
    } else {
      showToast('Already in cart!, quantity increased', "error");
    }
  };

  const handleComment = async (e: React.FormEvent<HTMLFormElement>, postId: number) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Please log in to comment', "error");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const content = formData.get('content') as string;
    if (!content.trim()) {
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
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost((prev: any) => prev ? {
            ...prev,
            comment_count: prev.comment_count + 1,
            comments: [...(prev.comments || []), newComment]
          } : null);
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
      showToast('Please log in to delete comments', "error");
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

  // --- Add state for deleting post ---
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [deletePostMessage, setDeletePostMessage] = useState<string | null>(null);

  // --- Handler to delete a post ---
  const handleDeletePost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setDeletingPostId(postId);
    setDeletePostMessage(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${postId}/delete/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        // Remove the post from the posts state (use the correct setter)
        setUserPosts((prev: Post[]) => prev.filter((p: Post) => p.id !== postId));
        setSelectedPost(null); // Close the modal
        setDeletePostMessage('Post deleted!');
        setTimeout(() => {
          if (typeof router !== 'undefined' && typeof router.refresh === 'function') {
            router.refresh();
          } else {
            window.location.reload();
          }
        }, 500);
      } else {
        setDeletePostMessage('Failed to delete post.');
      }
    } catch (e) {
      setDeletePostMessage('Error deleting post.');
    } finally {
      setDeletingPostId(null);
      setTimeout(() => setDeletePostMessage(null), 2000);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Header Bar */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.headerContent}>
            {/* Logo */}
            <div className={styles.logoSection}>
              <Link href="/" className={styles.logo}>
                <span className={styles.logoText}>Art</span>
                <span className={styles.logoHighlight}>Case</span>
              </Link>
            </div>

            {/* Cart and Profile Menu */}
            <div className={styles.headerActions}>
              <div className={styles.cartButton}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={styles.headerButton}
                  onClick={() => setShowCart(!showCart)}
                >
                  <ShoppingCart className={styles.headerButtonIcon} />
                  {cartItemCount > 0 && <span className={styles.cartBadge}>{cartItemCount}</span>}
                </Button>
              </div>
              <div className={styles.notificationWrapper}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${styles.headerButton} ${styles.notificationButton}`}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className={styles.headerButtonIcon} />
                  {unreadCount > 0 && <span className={styles.notificationBadge}>{unreadCount}</span>}
                </Button>

                {showNotifications && (
                  <div className={styles.notificationDropdown}>
                    <div className={styles.notificationHeader}>
                      <h3 className={styles.notificationTitle}>Notifications</h3>
                      {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className={styles.markAllReadButton} onClick={markAllAsRead}>
                          Mark all read
                        </Button>
                      )}
                    </div>

                    <div className={styles.notificationList}>
                      {notifications.length === 0 ? (
                        <div className={styles.emptyNotifications}>
                          <Bell className={styles.emptyNotificationIcon} />
                          <p className={styles.emptyNotificationText}>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`${styles.notificationItem} ${!notification.is_read ? styles.notificationUnread : ""}`}
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
                        <Button variant="ghost" className={styles.viewAllButton}>
                          View all notifications
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={styles.profileButton}>
                    <Avatar className={styles.profileAvatar}>
                      <AvatarImage
                        src={userData?.profile_pic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"}
                        alt="Profile"
                      />
                      <AvatarFallback>{userData?.first_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={styles.dropdownMenuContent} align="end" forceMount>
                  <DropdownMenuLabel className={styles.dropdownLabelCustom}>
                    <div className={styles.dropdownUserInfo}>
                      <p className={styles.dropdownUserName}>{userData?.first_name} {userData?.last_name}</p>
                      <p className={styles.dropdownUserEmail}>{userData?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className={styles.dropdownIcon} />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className={styles.dropdownIcon} />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className={styles.dropdownIcon} />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Cart Sidebar */}
      <div className={`${styles2.cartSidebar} ${showCart ? styles2.cartSidebarOpen : ""}`} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div className={styles2.cartHeader} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className={styles2.cartTitle}>Shopping Cart</h2>
          <button
            className={styles2.cartCloseButton}
            onClick={() => setShowCart(false)}
          >
            <i className={`fas fa-times ${styles2.cartCloseIcon}`}></i>
          </button>
        </div>
        {/* Tab Switcher Row */}
        <div className={styles2.tabSwitcher}>
          <button
            onClick={() => setActiveSidebarTab('cart')}
            className={`${styles2.tabButton} ${activeSidebarTab === 'cart' ? styles2.tabButtonActive : styles2.tabButtonInactive}`}
          >
            Cart
            {cartItems.length > 0 && (
              <span className={styles2.tabBadge}>{cartItems.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveSidebarTab('orders')}
            className={`${styles2.tabButton} ${activeSidebarTab === 'orders' ? styles2.tabButtonActive : styles2.tabButtonInactive}`}
          >
            Orders
            {orderHistory.length > 0 && (
              <span className={styles2.tabBadge}>{orderHistory.length}</span>
            )}
          </button>
        </div>
        <div className={styles2.cartContentContainer}>
          {/* Tab content switcher */}
          {activeSidebarTab === 'orders' && (
            <div className={styles2.orderHistoryContainer}>
              <h3 className={styles2.orderHistoryTitle}>Order History</h3>
              
              {orderHistory.length === 0 ? (
                <div className={styles2.orderHistoryEmpty}>No previous orders found.</div>
              ) : (
                <div className={styles2.orderHistoryList}>
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
                      <div key={orderId} className={styles2.orderCard}>
                        <div className={styles2.orderHeader}>
                          <div className={styles2.orderId}>Order #{orderId} <span className={styles2.orderStatus}>({orderStatus})</span></div>
                          <div className={styles2.orderDate}>{orderCreatedAt ? new Date(orderCreatedAt).toLocaleString() : ''}</div>
                        </div>
                        <div className={styles2.orderItems}>
                          {orderItems && Array.isArray(orderItems) && orderItems.length > 0 ? (
                            orderItems.map((item: any, index: number) => (
                              <div key={item.id || index} className={styles2.orderItem}>
                                <img src={item.image} alt={item.name} className={styles2.orderItemImage} />
                                <div className={styles2.orderItemDetails}>
                                  <span className={styles2.orderItemName}>{item.name}</span>
                                  <span className={styles2.orderItemModel}>{item.modell}</span>
                                  <span className={styles2.orderItemQuantity}>x{item.quantity}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <span className={styles2.orderHistoryEmpty}>
                              {orderItems ? 'No items' : 'Order details not available'}
                            </span>
                          )}
                        </div>
                        <div className={styles2.orderInfo}>
                          <span><span className={styles2.orderInfoBold}>Name:</span> {orderFirstName || 'N/A'} {orderLastName || ''}</span> &nbsp;|&nbsp; <span><span className={styles2.orderInfoBold}>Email:</span> {orderEmail || 'N/A'}</span>
                        </div>
                        <div className={styles2.orderInfo}>
                          <span><span className={styles2.orderInfoBold}>Shipping:</span> {orderAddress || 'N/A'}, {orderCity || 'N/A'}, {orderCountry || 'N/A'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {activeSidebarTab === 'cart' && cartItems.length > 0 && (
            <div className={styles2.cartItems}>
              <h4 className={styles2.cartItemsTitle}>Current Cart</h4>
              <div className={styles2.cartItemsList}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles2.cartItem}>
                    <div className={styles2.cartItemImage}>
                      <img src={item.image} alt={item.title} />
                      <span className={styles2.cartItemBadge}>
                        {item.type === 'customed clear case' ? 'Clear' : 'Rubber'}
                      </span>
                    </div>
                    <div className={styles2.cartItemDetails}>
                      <h4 className={styles2.cartItemTitle}>{item.title}</h4>
                      <p className={styles2.cartItemModel}>{item.model}</p>
                      <p className={styles2.cartItemPrice}>${item.price}</p>
                      <div className={styles2.cartItemActions}>
                        <div className={styles2.quantityControls}>
                          <button
                            className={`${styles2.quantityButton} ${item.quantity <= 1 ? styles2.quantityButtonDisabled : ''}`}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className={styles2.quantity}>{item.quantity}</span>
                          <button
                            className={`${styles2.quantityButton} ${item.quantity >= 9 ? styles2.quantityButtonDisabled : ''}`}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= 9}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        <button
                          className={styles2.removeButton}
                          onClick={() => removeItem(item.id)}
                        >
                          <i className={`fas fa-trash ${styles2.removeIcon}`}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles2.cartFooter}>
                <div className={styles2.cartTotal}>
                  <span className={styles2.cartTotalLabel}>Total:</span>
                  <span className={styles2.cartTotalAmount}>${cartTotal.toFixed(2)}</span>
                </div>
                <button className={styles2.checkoutButton} onClick={() => router.push('/newordernow')}>
                  Proceed to Checkout
                </button>
                <button className={styles2.continueShoppingButton} onClick={() => setShowCart(false)}>
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showCart && <div className={styles2.cartOverlay} onClick={() => setShowCart(false)} />}

      <div className={styles.mainContainer}>
        {/* Loading State */}
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading your profile...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {/* Profile Summary Section */}
        {!loading && !error && userData && (
          <Card className={styles.profileSummary}>
            <CardContent className={styles.profileContent}>
              <div className={styles.profileInfo}>
                {/* Left Side - Profile Info */}
                <div className={styles.profileLeft}>
                  <Avatar className={styles.profilePicture}>
                    <AvatarImage
                      src={userData.profile_pic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face"}
                      alt={`${userData.first_name} ${userData.last_name}`}
                    />
                    <AvatarFallback className={styles.profileFallback}>
                      {userData.first_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className={styles.profileDetails}>
                    <h1 className={styles.profileName}>{userData.first_name} {userData.last_name}</h1>
                    <p className={styles.profileUsername}>@{userData.username}</p>
                    <p className={styles.profileEmail}>{userData.email}</p>
                    <Button className={styles.editButton}>
                      <Edit3 className={styles.editButtonIcon} />
                      Edit Profile
                    </Button>
                  </div>
                </div>

                {/* Right Side - Stats */}
                <div className={styles.profileStats}>
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{userStats.designs}</div>
                    <div className={styles.statLabel}>Designs</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{userStats.posts}</div>
                    <div className={styles.statLabel}>Posts</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{userStats.likes}</div>
                    <div className={styles.statLabel}>Likes</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{userStats.saves}</div>
                    <div className={styles.statLabel}>Saves</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Quick Access Cards */}
        {!loading && !error && userData && (
          <div className={styles.dashboardCards}>
            <Card 
              className={`${styles.dashboardCard} ${activeTab === "designs" ? styles.dashboardCardActive : ""}`} 
              onClick={() => handleTabChange("designs")}
            >
              <CardHeader className={styles.cardHeaderCustom}>
                <div className={styles.cardHeaderContent}>
                  <Palette className={`${styles.cardIcon} ${styles.cardIconBrand}`} />
                  <Badge variant="secondary">{userStats.designs}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className={styles.cardTitleCustom}>My Designs</CardTitle>
                <CardDescription>View all your case designs</CardDescription>
              </CardContent>
            </Card>

            <Card 
              className={`${styles.dashboardCard} ${activeTab === "posts" ? styles.dashboardCardActive : ""}`} 
              onClick={() => handleTabChange("posts")}
            >
              <CardHeader className={styles.cardHeaderCustom}>
                <div className={styles.cardHeaderContent}>
                  <Share2 className={`${styles.cardIcon} ${styles.cardIconBrand}`} />
                  <Badge variant="secondary">{userStats.posts}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className={styles.cardTitleCustom}>My Posts</CardTitle>
                <CardDescription>Your shared content</CardDescription>
              </CardContent>
            </Card>

            <Card 
              className={`${styles.dashboardCard} ${activeTab === "likes" ? styles.dashboardCardActive : ""}`} 
              onClick={() => handleTabChange("likes")}
            >
              <CardHeader className={styles.cardHeaderCustom}>
                <div className={styles.cardHeaderContent}>
                  <Heart className={`${styles.cardIcon} ${styles.cardIconBrand}`} />
                  <Badge variant="secondary">{userStats.likes}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className={styles.cardTitleCustom}>Liked Posts</CardTitle>
                <CardDescription>Posts you've liked</CardDescription>
              </CardContent>
            </Card>

            <Card 
              className={`${styles.dashboardCard} ${activeTab === "saves" ? styles.dashboardCardActive : ""}`} 
              onClick={() => handleTabChange("saves")}
            >
              <CardHeader className={styles.cardHeaderCustom}>
                <div className={styles.cardHeaderContent}>
                  <Bookmark className={`${styles.cardIcon} ${styles.cardIconBrand}`} />
                  <Badge variant="secondary">{userStats.saves}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className={styles.cardTitleCustom}>Saved Posts</CardTitle>
                <CardDescription>Your bookmarked content</CardDescription>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs Section */}
        {!loading && !error && userData && (
          <Card className={styles.contentSection}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className={styles.tabsCustom}>
              <div className={styles.tabsHeader}>
                <TabsList className={styles.tabsListCustom}>
                  <TabsTrigger
                    value="designs"
                    className={`${styles.tabTrigger} ${activeTab === "designs" ? styles.tabsTriggerActive : ""}`}
                  >
                    <Palette className={styles.tabIcon} />
                    <span className={styles.tabText}>Designs</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="posts"
                    className={`${styles.tabTrigger} ${activeTab === "posts" ? styles.tabsTriggerActive : ""}`}
                  >
                    <Share2 className={styles.tabIcon} />
                    <span className={styles.tabText}>Posts</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="likes"
                    className={`${styles.tabTrigger} ${activeTab === "likes" ? styles.tabsTriggerActive : ""}`}
                  >
                    <Heart className={styles.tabIcon} />
                    <span className={styles.tabText}>Likes</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="saves"
                    className={`${styles.tabTrigger} ${activeTab === "saves" ? styles.tabsTriggerActive : ""}`}
                  >
                    <Bookmark className={styles.tabIcon} />
                    <span className={styles.tabText}>Saves</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className={styles.tabContent}>
                <TabsContent
                  value="designs"
                  className={`${styles.tabPane} ${activeTab === "designs" ? styles.tabsContentActive : ""}`}
                >
                  <div className={styles.tabHeader}>
                    <h2 className={styles.tabTitle}>My Designs</h2>
                    <div className={styles.filterButtons}>
                      <Button variant={designsFilter === 'recent' ? 'default' : 'outline'} size="sm" className={styles.filterButton} onClick={() => setDesignsFilter('recent')}>
                        Recent
                      </Button>
                      <Button variant={designsFilter === 'rubber' ? 'default' : 'outline'} size="sm" className={styles.filterButton} onClick={() => setDesignsFilter('rubber')}>
                        Rubber
                      </Button>
                      <Button variant={designsFilter === 'clear' ? 'default' : 'outline'} size="sm" className={styles.filterButton} onClick={() => setDesignsFilter('clear')}>
                        Clear
                      </Button>
                    </div>
                  </div>
                  <div className={styles.designsGrid}>
                    {filteredDesigns.map((design) => (
                      <Card key={design.id} className={styles.designCard} onClick={() => { setSelectedDesign(design); setShowDesignModal(true); }}>
                        {/* Delete button (top-right) */}
                        {design.user === loggedInUserId && (
                          <button
                            className={styles.deleteDesignButton}
                            title="Delete Design"
                            disabled={deletingDesignId === design.id}
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteDesign(design.id);
                            }}
                          >
                            {deletingDesignId === design.id ? 'Deleting...' : <FaTrash />}
                          </button>
                        )}
                        <div className={styles.designImage}>
                          <img src={design.image_url || "/placeholder.svg"} alt={design.modell} className={styles.designImg} />
                          <Badge
                            className={styles.designBadge}
                            variant={design.type === "clear" ? "default" : "secondary"}
                          >
                            {design.type === 'customed clear case' ? 'Clear' : 'Rubber'}
                          </Badge>
                        </div>
                        <CardContent className={styles.designInfo}>
                          <h3 className={styles.designTitle}>{design.modell}</h3>
                          <div className={styles.designStats}>
                            <div className={styles.designLikes}>
                              <Heart className={styles.designLikeIcon} />
                              <span>${design.price}</span>
                            </div>
                            <Button variant="ghost" size="sm" className={styles.designAction}>
                              <Grid3X3 className={styles.designActionIcon} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent
                  value="posts"
                  className={`${styles.tabPane} ${activeTab === "posts" ? styles.tabsContentActive : ""}`}
                >
                  <div className={styles.tabHeader}>
                    <h2 className={styles.tabTitle}>My Posts</h2>
                    <div className={styles.filterButtons}>
                      <Button variant={postsFilter === 'recent' ? 'default' : 'outline'} size="sm" className={styles.filterButton} onClick={() => setPostsFilter('recent')}>
                        Recent
                      </Button>
                      <Button variant={postsFilter === 'rubber' ? 'default' : 'outline'} size="sm" className={styles.filterButton} onClick={() => setPostsFilter('rubber')}>
                        Rubber
                      </Button>
                      <Button variant={postsFilter === 'clear' ? 'default' : 'outline'} size="sm" className={styles.filterButton} onClick={() => setPostsFilter('clear')}>
                        Clear
                      </Button>
                      <Button variant={postsFilter === 'most_liked' ? 'default' : 'outline'} size="sm" className={styles.filterButton} onClick={() => setPostsFilter('most_liked')}>
                        Most Liked
                      </Button>
                      <Button variant={postsFilter === 'most_commented' ? 'default' : 'outline'} size="sm" className={styles.filterButton} onClick={() => setPostsFilter('most_commented')}>
                        Most Commented
                      </Button>
                    </div>
                  </div>
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
                  {viewMode === "detailed" ? (
                    <div className={styles.postsList}>
                      {filteredPosts.map((post) => (
                        <Card key={post.id} className={styles.postCard} onClick={() => handlePostClick(post)}>
                          <CardContent className={styles.postContentWithImage}>
                            <div className={styles.postHeader}>
                              <div className={styles.postAuthor} onClick={() => {
                                if (post.user_id === currentUserId) {
                                  router.push('/newprofile');
                                } else {
                                  router.push(`/someoneProfile/${post.user_id}`);
                                }
                              }}>
                                <Avatar className={styles.postAuthorAvatar}>
                                  <AvatarImage
                                    src={post.profile_pic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                                    alt={post.first_name}
                                  />
                                  <AvatarFallback>{post.first_name?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className={styles.postAuthorInfo}>
                                  <p className={styles.postAuthorName}>{post.first_name} {post.last_name}</p>
                                  <p className={styles.postTimestamp}>{formatDateDMY(post.created_at)}</p>
                                </div>
                              </div>
                              <Badge
                                variant={post.design.type === "clear" ? "default" : "secondary"}
                                className={styles.postTypeBadge}
                              >
                                {post.design?.type === 'customed clear case' ? 'Clear' : 'Rubber'}
                              </Badge>
                            </div>

                            <h3 className={styles.postTitle}>{post.caption}</h3>
                            <p className={styles.postText}>{post.description}</p>

                            {post.design.image_url && (
                              <div className={styles.postImageContainer}>
                                <img src={post.design.image_url || "/placeholder.svg"} alt={post.caption} className={styles.postImage} />
                              </div>
                            )}

                            <div className={styles.postActions}>
                              <div className={styles.postStats}>
                                <div className={styles.postStat}>
                                  <Heart className={styles.postStatIcon} />
                                  <span>{post.like_count} likes</span>
                                </div>
                                <div className={styles.postStat}>
                                  <MessageSquare className={styles.postStatIcon} />
                                  <span>{post.comment_count} comments</span>
                                </div>
                                <div className={styles.postStat}>
                                  <Bookmark className={styles.postStatIcon} />
                                  <span>{post.favorite_count} saves</span>
                                </div>
                              </div>
                              <div className={styles.postActionButtons}>
                                <Button variant="ghost" size="sm" className={styles.postActionButton}>
                                  <Heart className={styles.postActionIcon} />
                                </Button>
                                <Button variant="ghost" size="sm" className={styles.postActionButton}>
                                  <MessageSquare className={styles.postActionIcon} />
                                </Button>
                                <Button variant="ghost" size="sm" className={styles.postActionButton}>
                                  <Bookmark className={styles.postActionIcon} />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.simplePostsGrid}>
                      {filteredPosts.map((post) => (
                        <Card key={post.id} className={styles.simplePostCard} onClick={() => handlePostClick(post)}>
                          <CardContent className={styles.simplePostContent}>
                            <h3 className={styles.simplePostTitle}>{post.caption}</h3>
                            {post.design.image_url && (
                              <div className={styles.simplePostImageContainer}>
                                <img src={post.design.image_url || "/placeholder.svg"} alt={post.caption} className={styles.simplePostImage} />
                              </div>
                            )}
                            <div className={styles.simplePostMetaRow}>
                              <div className={styles.simplePostStats}>
                                <div className={styles.simplePostStat}>
                                  <Heart className={styles.simplePostStatIcon} />
                                  <span>{post.like_count}</span>
                                </div>
                                <div className={styles.simplePostStat}>
                                  <MessageSquare className={styles.simplePostStatIcon} />
                                  <span>{post.comment_count}</span>
                                </div>
                                <div className={styles.simplePostStat}>
                                  <Bookmark className={styles.simplePostStatIcon} />
                                  <span>{post.favorite_count} saves</span>
                                </div>
                              </div>
                              <div className={styles.simplePostDate}>{getRelativeTime(post.created_at)}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent
                  value="likes"
                  className={`${styles.tabPane} ${activeTab === "likes" ? styles.tabsContentActive : ""}`}
                >
                  <div className={styles.tabHeader}>
                    <h2 className={styles.tabTitle}>Liked Posts</h2>
                    <div className={styles.filterButtons}>
                      <Button variant={likesFilter === 'recent' ? 'default' : 'outline'} size="sm" className={styles.filterButton} onClick={() => setLikesFilter('recent')}>
                        Recent
                      </Button>
                      <Button variant={likesFilter === 'rubber' ? 'default' : 'outline'} size="sm" className={styles.filterButton} onClick={() => setLikesFilter('rubber')}>
                        Rubber
                      </Button>
                      <Button variant={likesFilter === 'clear' ? 'default' : 'outline'} size="sm" className={styles.filterButton} onClick={() => setLikesFilter('clear')}>
                        Clear
                      </Button>
                    </div>
                  </div>
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
                  {filteredLikes.length > 0 ? (
                    viewMode === "detailed" ? (
                      <div className={styles.postsList}>
                        {filteredLikes.map((post) => (
                          <Card key={post.id} className={styles.postCard} onClick={() => handlePostClick(post)}>
                            <CardContent className={styles.postContentWithImage}>
                              <div className={styles.postHeader}>
                                <div className={styles.postAuthor}>
                                  <Avatar className={styles.postAuthorAvatar}>
                                    <AvatarImage
                                      src={post.profile_pic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                                      alt={post.first_name}
                                    />
                                    <AvatarFallback>{post.first_name?.charAt(0) || 'U'}</AvatarFallback>
                                  </Avatar>
                                  <div className={styles.postAuthorInfo}>
                                    <p className={styles.postAuthorName}>{post.first_name} {post.last_name}</p>
                                    <p className={styles.postTimestamp}>{formatDateDMY(post.created_at)}</p>
                                  </div>
                                </div>
                                <Badge
                                  variant={post.design.type === "clear" ? "default" : "secondary"}
                                  className={styles.postTypeBadge}
                                >
                                  {post.design?.type === 'customed clear case' ? 'Clear' : 'Rubber'}
                                </Badge>
                              </div>

                              <h3 className={styles.postTitle}>{post.caption}</h3>
                              <p className={styles.postText}>{post.description}</p>

                              {post.design.image_url && (
                                <div className={styles.postImageContainer}>
                                  <img src={post.design.image_url || "/placeholder.svg"} alt={post.caption} className={styles.postImage} />
                                </div>
                              )}

                              <div className={styles.postActions}>
                                <div className={styles.postStats}>
                                  <div className={styles.postStat}>
                                    <Heart className={styles.postStatIcon} />
                                    <span>{post.like_count} likes</span>
                                  </div>
                                  <div className={styles.postStat}>
                                    <MessageSquare className={styles.postStatIcon} />
                                    <span>{post.comment_count} comments</span>
                                  </div>
                                  <div className={styles.postStat}>
                                    <Bookmark className={styles.postStatIcon} />
                                    <span>{post.favorite_count} saves</span>
                                  </div>
                                </div>
                                <div className={styles.postActionButtons}>
                                  <Button variant="ghost" size="sm" className={styles.postActionButton}>
                                    <Heart className={styles.postActionIcon} />
                                  </Button>
                                  <Button variant="ghost" size="sm" className={styles.postActionButton}>
                                    <MessageSquare className={styles.postActionIcon} />
                                  </Button>
                                  <Button variant="ghost" size="sm" className={styles.postActionButton}>
                                    <Bookmark className={styles.postActionIcon} />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.simplePostsGrid}>
                        {filteredLikes.map((post) => (
                          <Card key={post.id} className={styles.simplePostCard} onClick={() => handlePostClick(post)}>
                            <CardContent className={styles.simplePostContent}>
                              <h3 className={styles.simplePostTitle}>{post.caption}</h3>
                              {post.design.image_url && (
                                <div className={styles.simplePostImageContainer}>
                                  <img src={post.design.image_url || "/placeholder.svg"} alt={post.caption} className={styles.simplePostImage} />
                                </div>
                              )}
                              <div className={styles.simplePostMetaRow}>
                                <div className={styles.simplePostStats}>
                                  <div className={styles.simplePostStat}>
                                    <Heart className={styles.simplePostStatIcon} />
                                    <span>{post.like_count}</span>
                                  </div>
                                  <div className={styles.simplePostStat}>
                                    <MessageSquare className={styles.simplePostStatIcon} />
                                    <span>{post.comment_count}</span>
                                  </div>
                                  <div className={styles.simplePostStat}>
                                    <Bookmark className={styles.simplePostStatIcon} />
                                    <span>{post.favorite_count} saves</span>
                                  </div>
                                </div>
                                <div className={styles.simplePostDate}>{getRelativeTime(post.created_at)}</div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className={styles.emptyState}>
                      <Heart className={styles.emptyIcon} />
                      <h3 className={styles.emptyTitle}>No liked posts yet</h3>
                      <p className={styles.emptyText}>Posts you like will appear here</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent
                  value="saves"
                  className={`${styles.tabPane} ${activeTab === "saves" ? styles.tabsContentActive : ""}`}
                >
                  <div className={styles.tabHeader}>
                    <h2 className={styles.tabTitle}>Saved Posts</h2>
                    <div className={styles.filterButtons}>
                      <Button variant={savesFilter === 'recent' ? 'default' : 'outline'} size="sm" className={styles.filterButton} onClick={() => setSavesFilter('recent')}>
                        Recent
                      </Button>
                      <Button variant={savesFilter === 'rubber' ? 'default' : 'outline'} size="sm" className={styles.filterButton} onClick={() => setSavesFilter('rubber')}>
                        Rubber
                      </Button>
                      <Button variant={savesFilter === 'clear' ? 'default' : 'outline'} size="sm" className={styles.filterButton} onClick={() => setSavesFilter('clear')}>
                        Clear
                      </Button>
                    </div>
                  </div>
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
                  {filteredSaves.length > 0 ? (
                    viewMode === "detailed" ? (
                      <div className={styles.postsList}>
                        {filteredSaves.map((post) => (
                          <Card key={post.id} className={styles.postCard} onClick={() => handlePostClick(post)}>
                            <CardContent className={styles.postContentWithImage}>
                              <div className={styles.postHeader}>
                                <div className={styles.postAuthor}>
                                  <Avatar className={styles.postAuthorAvatar}>
                                    <AvatarImage
                                      src={post.profile_pic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                                      alt={post.first_name}
                                    />
                                    <AvatarFallback>{post.first_name?.charAt(0) || 'U'}</AvatarFallback>
                                  </Avatar>
                                  <div className={styles.postAuthorInfo}>
                                    <p className={styles.postAuthorName}>{post.first_name} {post.last_name}</p>
                                    <p className={styles.postTimestamp}>{formatDateDMY(post.created_at)}</p>
                                  </div>
                                </div>
                                <Badge
                                  variant={post.design.type === "clear" ? "default" : "secondary"}
                                  className={styles.postTypeBadge}
                                >
                                  {post.design?.type === 'customed clear case' ? 'Clear' : 'Rubber'}
                                </Badge>
                              </div>

                              <h3 className={styles.postTitle}>{post.caption}</h3>
                              <p className={styles.postText}>{post.description}</p>

                              {post.design.image_url && (
                                <div className={styles.postImageContainer}>
                                  <img src={post.design.image_url || "/placeholder.svg"} alt={post.caption} className={styles.postImage} />
                                </div>
                              )}

                              <div className={styles.postActions}>
                                <div className={styles.postStats}>
                                  <div className={styles.postStat}>
                                    <Heart className={styles.postStatIcon} />
                                    <span>{post.like_count} likes</span>
                                  </div>
                                  <div className={styles.postStat}>
                                    <MessageSquare className={styles.postStatIcon} />
                                    <span>{post.comment_count} comments</span>
                                  </div>
                                  <div className={styles.postStat}>
                                    <Bookmark className={styles.postStatIcon} />
                                    <span>{post.favorite_count} saves</span>
                                  </div>
                                </div>
                                <div className={styles.postActionButtons}>
                                  <Button variant="ghost" size="sm" className={styles.postActionButton}>
                                    <Heart className={styles.postActionIcon} />
                                  </Button>
                                  <Button variant="ghost" size="sm" className={styles.postActionButton}>
                                    <MessageSquare className={styles.postActionIcon} />
                                  </Button>
                                  <Button variant="ghost" size="sm" className={styles.postActionButton}>
                                    <Bookmark className={styles.postActionIcon} />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.simplePostsGrid}>
                        {filteredSaves.map((post) => (
                          <Card key={post.id} className={styles.simplePostCard} onClick={() => handlePostClick(post)}>
                            <CardContent className={styles.simplePostContent}>
                              <h3 className={styles.simplePostTitle}>{post.caption}</h3>
                              {post.design.image_url && (
                                <div className={styles.simplePostImageContainer}>
                                  <img src={post.design.image_url || "/placeholder.svg"} alt={post.caption} className={styles.simplePostImage} />
                                </div>
                              )}
                              <div className={styles.simplePostMetaRow}>
                                <div className={styles.simplePostStats}>
                                  <div className={styles.simplePostStat}>
                                    <Heart className={styles.simplePostStatIcon} />
                                    <span>{post.like_count}</span>
                                  </div>
                                  <div className={styles.simplePostStat}>
                                    <MessageSquare className={styles.simplePostStatIcon} />
                                    <span>{post.comment_count}</span>
                                  </div>
                                  <div className={styles.simplePostStat}>
                                    <Bookmark className={styles.simplePostStatIcon} />
                                    <span>{post.favorite_count} saves</span>
                                  </div>
                                </div>
                                <div className={styles.simplePostDate}>{getRelativeTime(post.created_at)}</div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className={styles.emptyState}>
                      <Bookmark className={styles.emptyIcon} />
                      <h3 className={styles.emptyTitle}>No saved posts yet</h3>
                      <p className={styles.emptyText}>Posts you save will appear here</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        )}
      </div>

      {/* Modal for Design Details */}
      {showDesignModal && selectedDesign && (
        <div className={styles.modalOverlay} onClick={() => setShowDesignModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalLeft}>
              <img
                src={selectedDesign.image_url}
                alt={selectedDesign.modell}
                className={selectedDesign.type === 'customed rubber case' ? styles.postImagerubber : styles.postImageclear}
              />
    </div>
            <div className={styles.modalRight}>
              <div className={styles.modalHeader}>
                <h2>{selectedDesign.modell}</h2>
                <button className={styles.closeButton} onClick={() => setShowDesignModal(false)}>×</button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.postInfo}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}><Phone /></div>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Model</span>
                      <span className={styles.infoValue}>{selectedDesign.modell}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}><Palette /></div>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Type</span>
                      <span className={styles.infoValue}>{selectedDesign.type}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}><Grid3X3 /></div>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Class</span>
                      <span className={styles.infoValue}>{selectedDesign.theclass}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}><ShoppingCart /></div>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Stock</span>
                      <span className={styles.infoValue}>{selectedDesign.stock ==="Out of Stock" ? 'Out of Stock' : 'In Stock'}</span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}><Palette /></div>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Created</span>
                      <span className={styles.infoValue}>{formatDateDMY(selectedDesign.created_at)}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}><Palette /></div>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Price</span>
                      <span className={styles.infoValue}>${selectedDesign.price}</span>
                    </div>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className={styles.actionButtonsContainer}>
                  <button
                    className={styles.modalActionButton}
                    onClick={async () => {
                      if(selectedDesign.stock === "Out of Stock"){
                        showToast("This Item Is Out Of Stock Right Now", "error");
                         return;
                      }
                      // Add to cart logic (localStorage or API)
                      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                      const exists = cart.some((item: any) => item.id === selectedDesign.id);
                      if (!exists) {
                        cart.push({
                          id: selectedDesign.id,
                          image: selectedDesign.image_url,
                          title: selectedDesign.modell,
                          modell: selectedDesign.modell,
                          type: selectedDesign.type,
                          price: Number(selectedDesign.price),
                          quantity: 1,
                        });
                        localStorage.setItem('cart', JSON.stringify(cart));
                        window.dispatchEvent(new Event('cartUpdated'));
                        showToast('Added to cart!', "success");
                      } else {
                        showToast('Already in cart!, quantity increased', "error");
                      }
                    }}
                  >
                    <FaShoppingCart style={{ marginRight: 8 }} /> Add to Cart
                  </button>
                  <button
                    className={styles.modalActionButton}
                    onClick={async () => { router.push(`/makepost/${selectedDesign.id}`)}}
                  >
                    <FaShareAlt style={{ marginRight: 8 }} /> Share Design
                  </button>



                  <button
                    className={`${styles.modalActionButton} ${styles.secondary}`}
                    onClick={() => {
                      setShowDesignModal(false);
                      router.push('/newprofile');
                    }}
                  >
                    <FaArrowLeft style={{ marginRight: 8 }} /> Back to Profile
                  </button>

                                      <button
                      className={`${styles.modalActionButton} ${styles.danger}`}
                      disabled={deletingDesignId === selectedDesign?.id}
                      onClick={() => handleDeleteDesign(selectedDesign.id)}
                    >
                      {deletingDesignId === selectedDesign?.id ? 'Deleting...' : (<><FaTrash style={{ marginRight: 8 }} /> Delete Design</>)}
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {deleteMessage && (
        <div className={styles.deleteMessage}>{deleteMessage}</div>
      )}


{selectedPost && (
  <div className={styles1.modalOverlay} onClick={handleCloseModal}>
    <div className={styles1.modalContent} onClick={e => e.stopPropagation()}>
      <div className={styles1.modalLeft} style={{ position: 'relative' }}>
        {/* Delete Post button: top left, only for post owner */}
        {selectedPost.user_id === loggedInUserId && (
          <button
            className={styles1.deletePostButton}
            style={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}
            title="Delete Post"
            disabled={deletingPostId === selectedPost.id}
            onClick={() => handleDeletePost(selectedPost.id)}
          >
            <FaTrash style={{ marginRight: 4, color: 'white' }} /> Delete Post
            {deletingPostId === selectedPost.id ? 'Deleting...' : ''}
          </button>
        )}
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
                <span className={styles1.creatorUsername} onClick={() => {
                  if (selectedPost.user_id === currentUserId) {
                    router.push('/newprofile');
                  } else {
                    router.push(`/someoneProfile/${selectedPost.user_id}`);
                  }
                }}>@{selectedPost.user}</span>
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
    </div>
  )
}
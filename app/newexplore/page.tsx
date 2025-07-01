'use client';

import { useState, useEffect , useRef} from 'react';
import Image from 'next/image';
import { FiSearch, FiShoppingCart, FiArrowRight, FiTruck, FiRefreshCw, FiShield, FiCreditCard, FiMenu, FiX, FiFilter, FiTrendingUp, FiStar, FiClock, FiHeart, FiBookmark, FiEye, FiUser, FiGrid, FiAward, FiPenTool } from 'react-icons/fi';

import styles from './newexplore.module.css';
import styles1 from '../newui/newui.module.css';
import ccardStyles from './categorycards.module.css';

import Layout from '../newui/layout';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaComment, FaShoppingCart, FaMobile, FaTag,FaTrash, FaCalendarAlt, FaDollarSign, FaUpload, FaMobileAlt, FaEye, FaLock, FaShare, FaArrowRight, FaPlane, FaUndo, FaMapMarkerAlt, FaEnvelope, FaInstagram, FaTiktok, FaPinterest } from 'react-icons/fa';
import { fetchMostLikedDesigns, fetchTopUsersByLikes } from '../utils/apiUtils';
import { useRouter } from "next/navigation";
import { Router } from 'lucide-react';
// Helper components
const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => <div className={className}>{children}</div>;
const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => <div className={className}>{children}</div>;
const Badge = ({ className, children }: { className?: string; children: React.ReactNode }) => <span className={className}>{children}</span>;
const Button = ({ className, children, style }: { className?: string; children: React.ReactNode; style?: React.CSSProperties }) => <button className={className} style={style}>{children}</button>;


const HASHTAG_OPTIONS = [
  { label: "Anime", value: "Anime & Manga" },
  { label: "TV/Movies", value: "TV Shows & Movies" },
  { label: "Games", value: "Video Games" },
  { label: "Cartoons", value: "Cartoons & Animated Characters" },
  { label: "Pop", value: "Pop Culture & Music" },
  { label: "K-Pop", value: "K-Pop & Idol Groups" },
  { label: "Celebs", value: "Celebrities & Influencers" },
  { label: "Floral", value: "Floral & Botanical" },
  { label: "Scenery", value: "Scenery & Landscapes" },
  { label: "Abstract", value: "Abstract & Minimalist" },
  { label: "Cats/Dogs", value: "Cats & Dogs" },
  { label: "Wildlife", value: "Wildlife & Exotic Animals" },
  { label: "Fantasy", value: "Fantasy Creatures" },
  { label: "Sports", value: "Football & Basketball" },
  { label: "X-Sports", value: "Extreme Sports" },
  { label: "Fitness", value: "Fitness & Gym" },
  { label: "Motivational", value: "Motivational & Inspirational" },
  { label: "Funny", value: "Funny & Meme-Based" },
  { label: "Gothic", value: "Dark & Gothic" },
  { label: "Sci-Fi", value: "Cyberpunk & Sci-Fi" },
  { label: "Vaporwave", value: "Glitch & Vaporwave" },
  { label: "AI", value: "AI & Robotics" },
  { label: "Flags", value: "Flags & National Pride" },
  { label: "Trad Art", value: "Traditional Art" },
  { label: "Zodiac", value: "Astrology & Zodiac Signs" },
];
// Category Card Component
function CategoryCard({ category }: { category: any }) {
  return (
    <Card className={ccardStyles.categoryCard} >
      <div className={ccardStyles.imageContainer}>
        <div className={ccardStyles.gradientOverlay} style={{ background: `linear-gradient(to bottom right, ${category.gradient[0]}, ${category.gradient[1]})` }} />
        <div className={ccardStyles.iconContainer}>
          <div className={ccardStyles.icon}>{category.icon}</div>
        </div>
        <div className={ccardStyles.badgeContainer}>
          <Badge className={ccardStyles.badge}>
            {category.count}+ designs
          </Badge>
        </div>
      </div>
      <CardContent className={ccardStyles.cardContent}>
        <h3 className={ccardStyles.cardTitle}>{category.name}</h3>
        <p className={ccardStyles.cardDescription}>{category.description}</p>
      </CardContent>
    </Card>
  )
}

// Category Slide Card Component for Animated Slider
function CategorySlideCard({ category }: { category: any }) {
  return (
    <Card className={ccardStyles.slideCard} >
      <div className={ccardStyles.slideImageContainer} >
        <Image
          src={category.image || "/placeholder.svg?height=300&width=400"}
          alt={category.name}
          fill
          className={ccardStyles.slideImage}
        />
        <div className={ccardStyles.slideGradientOverlay} style={{ background: `linear-gradient(to top, ${category.gradient[0]}, ${category.gradient[1]})` }}/>
        <div className={ccardStyles.slideBadgeContainer}>
          <Badge className={ccardStyles.slideBadge}>{category.count}+ designs</Badge>
        </div>
        <div className={ccardStyles.slideInfoContainer}>
          <h3 className={ccardStyles.slideTitle}>
            {category.name}
          </h3>
          <p className={ccardStyles.slideDescription}>{category.description}</p>
        </div>

      </div>
    </Card>
  )
}

// Define Post interface
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
  comments: {
    author: string;
    avatar: string;
    text: string;
    date: string;
  }[];
}

// Define Backend Post interface
// Define Backend Post interface
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


// Mock data for all designs
const allDesigns = [
  {
    id: 1,
    title: 'Abstract Harmony',
    artist: 'Sarah Johnson',
    price: 29.99,
    image: 'https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png',
    artistAvatar: '/inspiration/e66ea461e14e113f67aa0b34db419404.jpg',
    likes: 1200,
    favorites: 856,
    category: 'Abstract',
    type: 'rubber',
    color: '#ff6b6b',
    date: '2024-03-15'
  },
  {
    id: 2,
    title: 'Geometric Patterns',
    artist: 'Mike Chen',
    price: 34.99,
    image: 'https://res.cloudinary.com/daalfrqob/image/upload/v1738846709/blob_ay8etw.png',
    artistAvatar: '/inspiration/e66ea461e14e113f67aa0b34db419404.jpg',
    likes: 2400,
    favorites: 1200,
    category: 'Geometric',
    type: 'clear',
    color: '#4ecdc4',
    date: '2024-03-10'
  },
  {
    id: 3,
    title: 'Ocean Waves',
    artist: 'Alex Rivera',
    price: 31.99,
    image: 'https://res.cloudinary.com/daalfrqob/image/upload/v1738846709/blob_ay8etw.png',
    artistAvatar: '/inspiration/e66ea461e14e113f67aa0b34db419404.jpg',
    likes: 1800,
    favorites: 950,
    category: 'Nature',
    type: 'clear',
    color: '#45b7d1',
    date: '2024-03-12'
  },
  {
    id: 4,
    title: 'Minimalist Flow',
    artist: 'Emma Wilson',
    price: 27.99,
    image: 'https://res.cloudinary.com/daalfrqob/image/upload/v1738846709/blob_ay8etw.png',
    artistAvatar: '/inspiration/e66ea461e14e113f67aa0b34db419404.jpg',
    likes: 950,
    favorites: 650,
    category: 'Minimalist',
    type: 'rubber',
    color: '#96ceb4',
    date: '2024-03-08'
  },
  {
    id: 5,
    title: 'Urban Vibes',
    artist: 'David Kim',
    price: 32.99,
    image: 'https://res.cloudinary.com/daalfrqob/image/upload/v1738846709/blob_ay8etw.png',
    artistAvatar: '/inspiration/e66ea461e14e113f67aa0b34db419404.jpg',
    likes: 1600,
    favorites: 890,
    category: 'Urban',
    type: 'clear',
    color: '#ffeaa7',
    date: '2024-03-14'
  },
  {
    id: 6,
    title: 'Cosmic Dreams',
    artist: 'Lisa Wong',
    price: 36.99,
    image: 'https://res.cloudinary.com/daalfrqob/image/upload/v1739121806/blob_cvgue8.png',
    artistAvatar: '/inspiration/e66ea461e14e113f67aa0b34db419404.jpg',
    likes: 2100,
    favorites: 1100,
    category: 'Abstract',
    type: 'clear',
    color: '#dda0dd',
    date: '2024-03-11'
  },
  {
    id: 7,
    title: "Nature's Touch",
    artist: 'James Miller',
    price: 28.99,
    image: 'https://res.cloudinary.com/daalfrqob/image/upload/v1749793488/blob_xjnlap.png',
    artistAvatar: '/inspiration/e66ea461e14e113f67aa0b34db419404.jpg',
    likes: 1300,
    favorites: 720,
    category: 'Nature',
    type: 'clear',
    color: '#81c784',
    date: '2024-03-09'
  },
  {
    id: 8,
    title: 'Digital Art',
    artist: 'Sophie Chen',
    price: 33.99,
    image: 'https://res.cloudinary.com/daalfrqob/image/upload/v1738845356/blob_ucogn2.png',
    artistAvatar: '/inspiration/e66ea461e14e113f67aa0b34db419404.jpg',
    likes: 1900,
    favorites: 980,
    category: 'Digital',
    type: 'clear',
    color: '#ff8a80',
    date: '2024-03-13'
  },
  {
    id: 9,
    title: 'Pop Culture',
    artist: 'Ryan Park',
    price: 35.99,
    image: 'https://res.cloudinary.com/daalfrqob/image/upload/v1738845928/blob_ovteq0.png',
    artistAvatar: '/inspiration/e66ea461e14e113f67aa0b34db419404.jpg',
    likes: 2800,
    favorites: 1400,
    category: 'Pop Culture',
    type: 'clear',
    color: '#e17055',
    date: '2024-03-07'
  },
  {
    id: 10,
    title: 'Anime Style',
    artist: 'Yuki Tanaka',
    price: 30.99,
    image: 'https://res.cloudinary.com/daalfrqob/image/upload/v1739123536/blob_kljyhd.png',
    artistAvatar: '/inspiration/e66ea461e14e113f67aa0b34db419404.jpg',
    likes: 3200,
    favorites: 1800,
    category: 'Anime',
    type: 'rubber',
    color: '#fd79a8',
    date: '2024-03-16'
  },
  {
    id: 11,
    title: 'Quote Design',
    artist: 'Maria Garcia',
    price: 25.99,
    image: 'https://res.cloudinary.com/daalfrqob/image/upload/v1749793488/blob_xjnlap.png',
    artistAvatar: '/inspiration/e66ea461e14e113f67aa0b34db419404.jpg',
    likes: 1100,
    favorites: 600,
    category: 'Quotes',
    type: 'clear',
    color: '#2d3436',
    date: '2024-03-06'
  },
  {
    id: 12,
    title: 'Street Art',
    artist: 'Carlos Rodriguez',
    price: 37.99,
    image: 'https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png',
    artistAvatar: '/inspiration/e66ea461e14e113f67aa0b34db419404.jpg',
    likes: 1700,
    favorites: 920,
    category: 'Urban',
    type: 'rubber',
    color: '#dfe6e9',
    date: '2024-03-05'
  }
];

// Mock data for top designers
const topDesigners = [
  {
    id: 1,
    name: 'Sarah Johnson',
    tagline: 'Cairo-based illustrator',
    avatar: '/inspiration/e66ea461e14e113f67aa0b34db419404.jpg',
    designs: 89,
    followers: 12345,
    badge: '⭐ Trending',
    specialty: 'Abstract Art',
    preview: '/inspiration/15540cf6caaec4216f0a251a782b656b.jpg',
    role: 'Illustrator',
    description: 'Award-winning illustrator specializing in abstract and modern art.',
    tags: ['Abstract', 'Modern', 'Minimalist']
  },
  {
    id: 2,
    name: 'Mike Chen',
    tagline: 'Digital artist from NYC',
    avatar: '/inspiration/e66ea461e14e113f67aa0b34db419404.jpg',
    designs: 67,
    followers: 9876,
    badge: '💎 Featured',
    specialty: 'Geometric Design',
    preview: '/inspiration/5f68f87039a5e3bd5caf8445d2d6dd64.jpg',
    role: 'Digital Artist',
    description: 'Known for bold geometric patterns and vibrant color palettes.',
    tags: ['Geometric', 'Digital', 'Contemporary']
  },
  {
    id: 3,
    name: 'Alex Rivera',
    tagline: 'Watercolor specialist',
    avatar: '/inspiration/e66ea461e14e113f67aa0b34db419404.jpg',
    designs: 45,
    followers: 8765,
    badge: '🆕 New',
    specialty: 'Nature Art',
    preview: '/inspiration/14123eb19ca9b63ac636fd6463fbaa42.jpg',
    role: 'Watercolor Artist',
    description: 'Captures the beauty of nature with delicate watercolor techniques.',
    tags: ['Nature', 'Watercolor', 'Traditional']
  },
  {
    id: 4,
    name: 'Emma Wilson',
    tagline: 'Minimalist designer',
    avatar: '/inspiration/e66ea461e14e113f67aa0b34db419404.jpg',
    designs: 78,
    followers: 7654,
    badge: '⭐ Trending',
    specialty: 'Minimalist',
    preview: '/inspiration/893b756bfce5669f1cd39e39001234a0.jpg',
    role: 'Minimalist Designer',
    description: 'Creates elegant, minimalist designs with a modern touch.',
    tags: ['Minimalist', 'Modern', 'Elegant']
  },
  {
    id: 5,
    name: 'Sarah Johnson',
    tagline: 'Cairo-based illustrator',
    avatar: '/inspiration/e66ea461e14e113f67aa0b34db419404.jpg',
    designs: 89,
    followers: 12345,
    badge: '⭐ Trending',
    specialty: 'Abstract Art',
    preview: '/inspiration/15540cf6caaec4216f0a251a782b656b.jpg',
    role: 'Illustrator',
    description: 'Award-winning illustrator specializing in abstract and modern art.',
    tags: ['Abstract', 'Modern', 'Minimalist']
  },
];

// Mock data for style categories
const styleCategories = [
  {
    id: 1,
    name: 'Abstract',
    description: 'Vibrant and modern abstract designs.',
    icon: '🎨',
    image: '/inspiration/15540cf6caaec4216f0a251a782b656b.jpg',
    gradient: ['#FF6B6B', '#FFD166'],
    count: 1250,
  },
  {
    id: 2,
    name: 'Pop Culture',
    description: 'Icons and moments from movies and TV.',
    icon: '📺',
    image: '/inspiration/ba8a2344f2ca9b39b06ff9d22b9cb91c.jpg',
    gradient: ['#4ECDC4', '#45B7D1'],
    count: 890,
  },
  {
    id: 3,
    name: 'Fantasy',
    description: 'Bring the outdoors to your phone case.',
    icon: '🌿',
    image: '/inspiration/9a73b7264a47f87cbfc8ec4baf20d707.jpg',
    gradient: ['#45B7D1', '#96CEB4'],
    count: 1100,
  },
  {
    id: 4,
    name: 'Cats/Dogs',
    description: 'Clean, simple, and elegant designs.',
    icon: '✨',
    image: '/inspiration/400f79182b4420fbeda30200a8d2e00d.jpg',
    gradient: ['#96CEB4', '#F6F6F6'],
    count: 750,
  },
  {
    id: 5,
    name: 'Anime',
    description: 'Designs from your favorite anime series.',
    icon: '🌸',
    image: '/inspiration/9d1f21dac78dbe45394da8152898cf5c.jpg',
    gradient: ['#FFEAA7', '#FDCB6E'],
    count: 650,
  },
  {
    id: 6,
    name: 'Motivational',
    description: 'Inspirational and witty text designs.',
    icon: '💬',
    image: '/inspiration/de2bcba89fd8112152a7cfa10a365a84.jpg',
    gradient: ['#DDA0DD', '#C4A1FF'],
    count: 420,
  },
  {
    id: 7,
    name: 'TV/Movies',
    description: 'Graffiti and street art inspired cases.',
    icon: '🏙️',
    image: '/inspiration/ee1578d13957fcfc378ecd28bef46ec9.jpg',
    gradient: ['#FF8A80', '#FF5252'],
    count: 580,
  },
  {
    id: 8,
    name: 'Funny',
    description: 'Futuristic and digitally crafted art.',
    icon: '💻',
    image: '/inspiration/797a681db3ccbda6d1eed3aca41d7fd7.jpg',
    gradient: ['#81C784', '#A5D6A7'],
    count: 920,
  }
];

// Mock data for featured designs
const featuredDesigns = [
  {
    id: 1,
    title: 'Abstract Waves',
    artist: 'Sarah Chen',
    price: 299,
    image: '/inspiration/15540cf6caaec4216f0a251a782b656b.jpg',
    artistAvatar: '/artists/sarah-chen.jpg',
    likes: 1234,
    views: 5678,
  },
  {
    id: 2,
    title: 'Geometric Patterns',
    artist: 'Michael Park',
    price: 349,
    image: '/inspiration/5f68f87039a5e3bd5caf8445d2d6dd64.jpg',
    artistAvatar: '/artists/michael-park.jpg',
    likes: 987,
    views: 4321,
  },
  {
    id: 3,
    title: 'Nature Inspired',
    artist: 'Emma Wilson',
    price: 399,
    image: '/inspiration/15540cf6caaec4216f0a251a782b656b.jpg',
    artistAvatar: '/artists/emma-wilson.jpg',
    likes: 2345,
    views: 8765,
  },
  {
    id: 4,
    title: 'Modern Minimalist',
    artist: 'David Kim',
    price: 279,
    image: '/inspiration/14123eb19ca9b63ac636fd6463fbaa42.jpg',
    artistAvatar: '/artists/david-kim.jpg',
    likes: 876,
    views: 3456,
  },
];

// Mock data for trending designs
const trendingDesigns = [
  {
    id: 5,
    title: 'Digital Dreams',
    artist: 'Alex Rivera',
    price: 329,
    image: '/designs/digital-dreams.jpg',
    artistAvatar: '/artists/alex-rivera.jpg',
    likes: 5432,
    views: 12345,
  },
  {
    id: 6,
    title: 'Urban Vibes',
    artist: 'Lisa Wong',
    price: 289,
    image: '/designs/urban-vibes.jpg',
    artistAvatar: '/artists/lisa-wong.jpg',
    likes: 3456,
    views: 9876,
  },
  {
    id: 7,
    title: 'Cosmic Journey',
    artist: 'James Miller',
    price: 379,
    image: '/designs/cosmic-journey.jpg',
    artistAvatar: '/artists/james-miller.jpg',
    likes: 4321,
    views: 8765,
  },
  {
    id: 8,
    title: 'Minimalist Flow',
    artist: 'Sophie Chen',
    price: 259,
    image: '/designs/minimalist-flow.jpg',
    artistAvatar: '/artists/sophie-chen.jpg',
    likes: 2345,
    views: 7654,
  },
];

// Mock data for featured creators
const featuredCreators = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Digital Artist',
    image: '/artists/sarah-chen.jpg',
    avatar: '/artists/sarah-chen-avatar.jpg',
    tags: ['Abstract', 'Digital Art', 'Modern'],
    followers: 12345,
    designs: 89,
  },
  {
    id: 2,
    name: 'Michael Park',
    role: 'Graphic Designer',
    image: '/artists/michael-park.jpg',
    avatar: '/artists/michael-park-avatar.jpg',
    tags: ['Geometric', 'Minimalist', 'Contemporary'],
    followers: 9876,
    designs: 67,
  },
  {
    id: 3,
    name: 'Emma Wilson',
    role: 'Illustrator',
    image: '/artists/emma-wilson.jpg',
    avatar: '/artists/emma-wilson-avatar.jpg',
    tags: ['Nature', 'Watercolor', 'Traditional'],
    followers: 8765,
    designs: 45,
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Visual Artist',
    image: '/artists/david-kim.jpg',
    avatar: '/artists/david-kim-avatar.jpg',
    tags: ['Modern', 'Abstract', 'Digital'],
    followers: 7654,
    designs: 78,
  },
];

// Popular tags
const popularTags = [
  'Abstract', 'Digital Art', 'Modern', 'Minimalist', 'Nature',
  'Watercolor', 'Geometric', 'Contemporary', 'Traditional', 'Illustration',
];

// Categories
const categories = [
  { id: 1, name: 'All', icon: '🎨' },
  { id: 2, name: 'Digital Art', icon: '💻' },
  { id: 3, name: 'Illustration', icon: '✏️' },
  { id: 4, name: 'Photography', icon: '📷' },
  { id: 5, name: '3D Art', icon: '🎮' },
  { id: 6, name: 'Typography', icon: '🔤' },
];


const designerDescriptions = [
  "Award-winning illustrator specializing in abstract and modern art. With a keen eye for detail and a passion for pushing creative boundaries, this artist’s portfolio is a journey through color, form, and imagination. Their work has been featured in international exhibitions and continues to inspire a new generation of creators.",
  "Known for bold geometric patterns and vibrant color palettes, this designer transforms everyday objects into stunning visual experiences. Their unique approach blends digital precision with artistic intuition, resulting in pieces that are both modern and timeless.",
  "A digital artist with a passion for futuristic themes, blending technology and creativity to craft immersive visual stories. Their portfolio showcases a diverse range of projects, from concept art to interactive installations, all united by a commitment to innovation.",
  "Minimalist designer creating clean and elegant visuals that speak volumes through simplicity. Their work is a testament to the power of less, using negative space and subtle color shifts to evoke emotion and meaning.",
  "Urban artist blending street style with digital techniques, capturing the energy and diversity of city life. Their murals and digital prints are celebrated for their dynamic compositions and bold use of color.",
  "Nature-inspired creator with a love for organic forms and earthy tones. Their art brings the beauty of the outdoors into everyday spaces, encouraging viewers to reconnect with the natural world.",
  "Pop culture enthusiast bringing icons to life with a fresh, contemporary twist. Their playful illustrations and character designs have garnered a loyal following on social media and beyond.",
  "Anime-style illustrator with a unique twist, merging traditional Japanese aesthetics with modern storytelling. Their characters are known for their expressive features and vibrant personalities.",
  "Quote designer making words beautiful, turning inspirational messages into works of art. Their typography and hand-lettering skills transform simple phrases into powerful visual statements.",
  "Street art specialist with a global following, renowned for large-scale murals and public installations. Their work often explores themes of community, identity, and social change, leaving a lasting impact wherever it appears."
  // Add more if you want even more variety!
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [activeTab, setActiveTab] = useState('trending');
 
  const sliderRef = useRef<HTMLDivElement>(null);
  const trendingDesignsData = allDesigns.slice(0, 9);

  const [totalSlides, setTotalSlides] = useState(0);
  const [selectedPost, setSelectedPost] = useState<BackendPost | null>(null);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Real posts from backend
  const [backendPosts, setBackendPosts] = useState<BackendPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);
  // Show more/less for backend posts
  const [showAllBackendPosts, setShowAllBackendPosts] = useState(false); // false = show 8, true = show all
  const visibleBackendPosts = showAllBackendPosts ? backendPosts.length : 10;
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(100);
  const [sortBy, setSortBy] = useState('newest');
  
  // Show more functionality
  const [visibleDesigns, setVisibleDesigns] = useState(10); // Show first 2 rows (5 columns × 2 rows)
  const designsPerRow = 5;
  const designsPerLoad = 15; // 3 rows at a time
  const [isExpanded, setIsExpanded] = useState(false);

  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

  const [mostLikedData, setMostLikedData] = useState<BackendPost[]>([]);
  const [mostLikedLoading, setMostLikedLoading] = useState(true);


  const [mostLikedError, setMostLikedError] = useState<string | null>(null);

  const [topUsers, setTopUsers] = useState([]);
  const router = useRouter();



  const totalCards = mostLikedData.length;
const cardWidth = 300;
const gap = 30;
const padding = 40;
const [visibleCards, setVisibleCards] = useState(1);
const [currentSlide, setCurrentSlide] = useState(0);


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
      .then(setTopUsers)
      .catch(console.error);
  }, []);

  const handleAddToCart = (product) => {
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
  
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = existingCart.findIndex((item) => item.id === cartItem.id);
  
    if (index > -1) {
      existingCart[index].quantity += 1;
      alert("This item is already in the cart. Quantity increased.");
    } else {
      existingCart.push(cartItem);
      alert("Added to cart!");
    }
  
    localStorage.setItem("cart", JSON.stringify(existingCart));
  
    // ✅ Trigger the event so layout updates the badge instantly
    window.dispatchEvent(new Event("cartUpdated"));
  };
  
  
  
  
  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setPostsLoading(true);
        setPostsError(null);
    
        // Get the token for authentication
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        
        let response;
        
        if (token) {
          // If token exists, use authenticated endpoint
          response = await fetch(`${apiUrl}/api/posts/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
        } else {
          // If no token, use public endpoint
          response = await fetch(`${apiUrl}/api/public-posts/`);
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const posts = await response.json();
        setBackendPosts(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPostsError(error instanceof Error ? error.message : 'Failed to fetch posts');
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const calculateSlides = () => {
      if (!sliderRef.current) return;
      const containerWidth = sliderRef.current.offsetWidth;
      const visible = Math.max(1, Math.floor((containerWidth - padding) / (cardWidth + gap)));
      setVisibleCards(visible);
    };
    calculateSlides();
    window.addEventListener('resize', calculateSlides);
    return () => window.removeEventListener('resize', calculateSlides);
  }, []);



  const fetchMostLiked = async () => {
    try {
      setMostLikedLoading(true);
      setMostLikedError(null);
      const data = await fetchMostLikedDesigns();
      setMostLikedData(data); // Use backend data as-is!
      console.log("most liked posts : " ,data)
    } catch (error) {
      setMostLikedError(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setMostLikedLoading(false);
    }
  };

  useEffect(() => {
    fetchMostLiked();
  }, []);


const maxSlideIndex = Math.max(0, Math.ceil((totalCards - visibleCards) / visibleCards));
const dotCount = maxSlideIndex + 1;

  const scrollToSlide = (pageIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(pageIndex, maxSlideIndex));
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



  useEffect(() => {
    const calculateVisible = () => {
      if (!sliderRef.current) return;
      const containerWidth = sliderRef.current.offsetWidth;
      const visible = Math.max(1, Math.floor((containerWidth - padding) / (cardWidth + gap)));
      setVisibleCards(visible);
    };
    calculateVisible();
    window.addEventListener('resize', calculateVisible);
    return () => window.removeEventListener('resize', calculateVisible);
  }, []);

  const handlePostClick = async (post: BackendPost) => {
    setSelectedPost(post);
    
    // Set initial like/favorite states from the post data
    setIsLiked(post.is_liked);
    setIsSaved(post.is_favorited);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };


  const debugPost = async (postId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to debug');
      return;
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/debug/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('DEBUG POST DATA:', data);
        setDebugInfo(data);
        setShowDebug(true);
      } else {
        console.error('Failed to get debug info');
      }
    } catch (error) {
      console.error('Error getting debug info:', error);
    }
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
  
        // Update mostLikedData
        setMostLikedData(prev =>
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
  
        // Update browseData (or whatever your browse section uses)
        setBackendPosts(prev =>
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
  
        // Optionally update selectedPost/modal state
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
  
        // Update mostLikedData
        setMostLikedData(prev =>
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
  
        // Update backendPosts (browse section)
        setBackendPosts(prev =>
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
  
        // Optionally update selectedPost/modal state if you have one
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


  console.log('dotCount:', dotCount, 'maxSlideIndex:', maxSlideIndex, 'visibleCards:', visibleCards, 'totalCards:', mostLikedData.length);

  
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
        setBackendPosts(prevPosts => 
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
        setBackendPosts(prevPosts => 
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


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Filter functions
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handlePriceChange = (value: number) => {
    setPriceRange(value);
  };


  const filteredPosts = backendPosts.filter((post) => {
    const hashtags = post.hashtag_names || [];
    const designColors = [
      post.design?.color1,
      post.design?.color2,
      post.design?.color3,
    ].map((color) => color?.trim().toLowerCase());
  
    // Search filter
    const matchesSearch = searchQuery === '' || 
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      
      post.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.design.modell.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.design.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  
    // Match any selected category (OR logic)
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) => hashtags.includes(cat));
  
    // Match selected colors (OR logic)
    const matchesColor =
      selectedColors.length === 0 ||
      selectedColors.some((selected) =>
        designColors.includes(selected.toLowerCase())
      );
  
    const matchesPrice = parseFloat(post.design.price) <= priceRange;
  
    return matchesSearch && matchesCategory && matchesColor && matchesPrice;
  });


  // Sort the filtered posts
const sortedPosts = [...filteredPosts].sort((a, b) => {
  switch (sortBy) {
    case 'newest':
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    case 'price-low':
      return parseFloat(a.design.price) - parseFloat(b.design.price);
    case 'price-high':
      return parseFloat(b.design.price) - parseFloat(a.design.price);
    case 'popular':
    default:
      return b.like_count - a.like_count;
  }
});

  // Filter the designs based on all criteria
  const filteredDesigns = allDesigns.filter(design => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(design.category);

    // Color filter (if design has color property)
    const matchesColor = selectedColors.length === 0 || 
      (design.color && selectedColors.includes(design.color));

    // Price filter
    const matchesPrice = design.price <= priceRange;

    return matchesSearch && matchesCategory && matchesColor && matchesPrice;
  });

  // Sort the filtered designs
  const sortedDesigns = [...filteredDesigns].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date || '2024-01-01').getTime() - new Date(a.date || '2024-01-01').getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'popular':
      default:
        return b.likes - a.likes;
    }
  });

  // Get designs to display
  const displayedDesigns = sortedDesigns.slice(0, visibleDesigns);

  // Handle show more
  const handleShowMore = () => {
    setVisibleDesigns(prev => prev + designsPerLoad);
    setIsExpanded(true);
  };

  // Handle show less
  const handleShowLess = () => {
    setVisibleDesigns(10); // Reset to initial 2 rows
    setIsExpanded(false);
  };

  // Check if there are more designs to show
  const hasMoreDesigns = visibleDesigns < sortedDesigns.length;
  
  // Check if we're showing more than initial amount
  const isShowingMore = visibleDesigns > 10;

  return (
    <Layout>
  <div>
    <div>
      {/* HERO SECTION 
    <section className={styles.heroSection + ' ' + styles.fadeInUp}>

      <div className={styles.bgDecoration + ' ' + styles.bgDecoration1}></div>
      <div className={styles.bgDecoration + ' ' + styles.bgDecoration2}></div>
      <div className={styles.bgDecoration + ' ' + styles.bgDecoration3}></div>

      <div className={styles.container}>
        <div className={styles.heroGrid}>

          <div className={styles.heroContent}>
            <span className={styles.badge}>✨ Over 50,000+ Unique Designs Available</span>
            <h1 className={styles.heroTitle}>
              Turn Your Phone Into a
              <span className={styles.gradientText}>Work of Art</span>
            </h1>
            <p className={styles.heroDescription}>
              Discover thousands of stunning phone case designs created by talented artists worldwide. Express your unique style with premium quality cases that protect and inspire.
            </p>
            <div className={styles.buttonGroup}>
              <button className={styles.btn + ' ' + styles.btnPrimary}>Explore Designs</button>
              <button className={styles.btn + ' ' + styles.btnSecondary}>Start Creating</button>
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>50K+</div>
                <div className={styles.statLabel}>Designs</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>1K+</div>
                <div className={styles.statLabel}>Artists</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>100K+</div>
                <div className={styles.statLabel}>Happy Customers</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>4.9★</div>
                <div className={styles.statLabel}>Rating</div>
              </div>
            </div>
          </div>


          <div className={styles.heroImages}>
            <div className={styles.phoneCasesGrid}>

              <div className={styles.phoneCase + ' ' + styles.phoneCase1}>
                <div className={styles.phoneCaseContainer}>
                  <div className={styles.phoneCaseInner}>
                    <img src="/inspiration/893b756bfce5669f1cd39e39001234a0.jpg" alt="Featured Design 1" className={styles.phoneCaseImage} />
                    <div className={styles.cameraCutout}></div>
                  </div>
                </div>
                <span className={styles.badgeHot}>
                  <svg className={styles.trendingIcon} viewBox="0 0 16 16"><path d="M2 10l4-4 3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                  Hot
                </span>
              </div>

              <div className={styles.phoneCase + ' ' + styles.phoneCase2}>
                <div className={styles.phoneCaseContainer}>
                  <div className={styles.phoneCaseInner}>
                    <img src="/inspiration/26d68b403d1999654e62323b19fda672.jpg" alt="Featured Design 2" className={styles.phoneCaseImage} />
                    <div className={styles.cameraCutout}></div>
                  </div>
                </div>
                <span className={styles.badgeNew}>New</span>
              </div>
            </div>

            <div className={styles.floatingPhone}>
              <div className={styles.floatingPhoneInner}>
                <img src="/inspiration/14123eb19ca9b63ac636fd6463fbaa42.jpg" alt="Featured Design 3" className={styles.floatingPhoneImage} />
                <div className={styles.cameraCutout}></div>
              </div>
            </div>

            <div className={styles.decorativeElement + ' ' + styles.decorative1}></div>
            <div className={styles.decorativeElement + ' ' + styles.decorative2}></div>
            <div className={styles.decorativeElement + ' ' + styles.decorative3}></div>
          </div>
        </div>
      </div>
    </section>
*/}



{/* FEATURED SECTION 
    <div className={styles1.featuredSectionWrapper}>
        <div className={styles1.featuredSection}>
          <div className={styles1.featuredDecoration}>
            <div className={styles1.featuredShape1}></div>
            <div className={styles1.featuredShape2}></div>
            <div className={styles1.featuredShape3}></div>
            <div className={styles1.featuredShape4}></div>
            <div className={styles1.featuredShape5}></div>
          </div>
          <motion.div 
            className={styles1.featuredHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles1.sectionTitle}>Featured Designs</h2>
            <p className={styles1.sectionSubtitle}>Discover our most popular and trending phone case designs, crafted by talented artists from around the world</p>
          </motion.div>
          <div className={styles1.sliderNav}>
            <motion.button 
              className={styles1.sliderButton} 
              onClick={prevSlide}
              disabled={currentSlide === 0}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <i className="fas fa-chevron-left"></i>
            </motion.button>
            <motion.button 
              className={styles1.sliderButton} 
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <i className="fas fa-chevron-right"></i>
            </motion.button>
          </div>
          <motion.div 
            className={styles1.cardsGrid} 
            ref={sliderRef}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles1.cards} onClick={() => handlePostClick({
              title: "Abstract Harmony",
              artist: "Sarah Johnson",
              image: "https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png",
              price: 29.99,
              date: "2024-03-15",
              model: "iPhone 14 Pro",
              type: "Slim Case",
              likes: 1200,
              favorites: 856,
              description: "A mesmerizing blend of vibrant colors and fluid shapes that creates a sense of movement and harmony. This design captures the essence of abstract art while maintaining a modern, minimalist aesthetic. Perfect for those who appreciate contemporary art and want to make a bold statement with their phone case.\n\nThe case features a premium matte finish that enhances the colors and provides a comfortable grip. The design is printed using high-quality UV printing technology, ensuring long-lasting vibrancy and durability.",
              tags: ["Abstract", "Modern", "Minimalist", "Colorful", "Artistic"],
              comments: [
                {
                  author: "John Doe",
                  avatar: "/inspiration/e66ea461e14e113f67aa0b34db419404.jpg",
                  text: "Amazing design! Love the colors.",
                  date: "2024-03-16"
                }
              ]
            })}>
              <div className={styles1.imgBack}>
                <img className={styles1.clearW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749121893/blob_cgahne.png" alt="Abstract Art" />
                <div className={styles1.imageStats}>
                  <div className={styles1.statRow}>
                    <button className={styles1.statButton} title="Like">
                      <i className="fas fa-heart"></i>
                      <span className={styles1.statCount}>1.2k</span>
                    </button>
                    <button className={styles1.statButton} title="Save">
                      <i className="fas fa-bookmark"></i>
                      <span className={styles1.statCount}>856</span>
                    </button>
                  </div>
                  <div className={styles1.price}>$29.99</div>
                </div>
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Abstract Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Sarah Johnson</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $29.99</button>
              </div>
            </div>

            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.clearW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1738845356/blob_ucogn2.png" alt="Geometric Pattern" />
                <div className={styles1.imageStats}>
                  <div className={styles1.statRow}>
                    <button className={`${styles1.statButton} ${styles1.liked}`} title="Liked">
                      <i className="fas fa-heart"></i>
                      <span className={styles1.statCount}>2.4k</span>
                    </button>
                    <button className={`${styles1.statButton} ${styles1.favorited}`} title="Saved">
                      <i className="fas fa-bookmark"></i>
                      <span className={styles1.statCount}>1.2k</span>
                    </button>
                  </div>
                  <div className={styles1.price}>$34.99</div>
                </div>
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>

            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.clearW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749793488/blob_xjnlap.png" alt="Abstract Design" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Abstract Waves</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Sarah Johnson</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $29.99</button>
              </div>
            </div>

            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1739123536/blob_kljyhd.png" alt="Geometric Pattern" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>
            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.rubberW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749667935/blob_iucqwq.png" alt="Geometric Pattern" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Geometric Harmony</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Mike Chen</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $34.99</button>
              </div>
            </div>

            <div className={styles1.cards}>
              <div className={styles1.imgBack}>
                <img className={styles1.clearW} src="https://res.cloudinary.com/daalfrqob/image/upload/v1749793488/blob_xjnlap.png" alt="Abstract Design" />
              </div>
              <div className={styles1.cardsContent}>
                <h3 className={styles1.title}>Ocean Breeze</h3>
                <div className={styles1.disc}>
                  <img src="/inspiration/e66ea461e14e113f67aa0b34db419404.jpg" alt="Artist" className={styles1.discprofile_pic} />
                  <span>By Alex Rivera</span>
                </div>
                <button className={styles1.btn5}>Add to Cart - $31.99</button>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className={styles1.sliderDots}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {[...Array(totalSlides)].map((_, index) => (
              <motion.div
                key={index}
                className={`${styles1.dot} ${currentSlide === index ? styles1.active : ''}`}
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
      */}
              </div>






    {/* SECTION 1: Browse All Designs */}
    <section className={styles.browseSection}>
      <div className={styles.browsecontainer}>
        <motion.div 
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className={styles1.highlight2}>Browse</span> All Designs
          </motion.h2>
          <motion.p 
            className={styles.sectionSubtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Explore our complete collection of unique phone case designs
          </motion.p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div 
          className={styles.topBar}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div 
            className={styles.searchContainer}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search designs..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
          <motion.div 
            className={styles.topBarActions}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <button className={styles.filterButton} onClick={toggleFilter}>
              <FiFilter />
              Filters
            </button>
            <select 
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </motion.div>
        </motion.div>
        
        <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            className={styles.filterPanel}
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className={styles.filterPanelContent}>
              <h3 className={styles.filterPanelTitle}>Filter Designs</h3>
              <div className={styles.filterGrid}>
                <div className={styles.filterGroup}>
                  <h4 className={styles.filterGroupTitle}>Categories</h4>
                  <div className={styles.tagGroup}>
                  {HASHTAG_OPTIONS.map((tag, index) => (
  <motion.button 
    key={tag.value}
    className={`${styles.tag} ${selectedCategories.includes(tag.value) ? styles.active : ''}`}
    onClick={() => handleCategoryToggle(tag.value)}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
  >
    {tag.label}
  </motion.button>
))}
            </div>
              </div>
              <div className={styles.filterGroup}>
  <h4 className={styles.filterGroupTitle}>Colors</h4>
  <div className={styles.tagGroup}>
    {[
      { color: '#ff6b6b', name: 'Red' },
      { color: '#4ecdc4', name: 'Teal' },
      { color: '#45b7d1', name: 'Blue' },
      { color: '#96ceb4', name: 'Green' },
      { color: '#ffeaa7', name: 'Yellow' },
      { color: '#e17055', name: 'Orange' },
      { color: '#2d3436', name: 'Black' },
      { color: '#dfe6e9', name: 'Gray' },
      { color: '#fd79a8', name: 'Pink' },
      { color: '#9b59b6', name: 'Purple' },
      { color: '#c8a2c8', name: 'Light Purple' },
      { color: '#34495e', name: 'Dark Blue' },
      { color: '#f5deb3', name: 'Beige' },
      { color: '#8b4513', name: 'Brown' },
      { color: '#ffffff', name: 'White' }
    ].map((colorItem, index) => (
      <motion.button
        key={colorItem.name}
        className={`${styles.colorTag} ${
          selectedColors.includes(colorItem.name) ? styles.active : ''
        }`}
        style={{ backgroundColor: colorItem.color }}
        onClick={() => handleColorToggle(colorItem.name)} // ✅ using name, not hex
        title={colorItem.name}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      />
    ))}
                </div>
              </div>
                <div className={styles.filterGroup}>
                  <h4 className={styles.filterGroupTitle}>Price Range: $0 - ${priceRange}</h4>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={priceRange}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    className={styles.priceSlider} 
                  />
                  <div className={styles.priceLabels}>
                    <span>$0</span>
                    <span>${priceRange}+</span>
            </div>
              </div>
                </div>
              </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Designs Grid */}
        <motion.div 
          className={styles.designsGrid}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {postsLoading && (
            <div style={{textAlign: 'center', width: '100%', color: '#888', fontSize: 18, padding: '2rem 0'}}>Loading designs...</div>
          )}
          {postsError && (
            <div style={{textAlign: 'center', width: '100%', color: '#ff6b6b', fontSize: 18, padding: '2rem 0'}}>Error: {postsError}</div>
          )}
          {!postsLoading && !postsError && backendPosts.length === 0 && (
            <div style={{textAlign: 'center', width: '100%', color: '#888', fontSize: 18, padding: '2rem 0'}}>No designs available.</div>
          )}
{!postsLoading && !postsError && sortedPosts.slice(0, visibleBackendPosts).map((post, index)  =>{ 
  
  console.log(`Rendering post ${post.id}:`, { is_liked: post.is_liked, is_favorited: post.is_favorited });
  return(
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
      <motion.button className={`${post.is_liked ? styles1.liked : ''} ${styles.likeButton}`} whileTap={{ scale: 0.9 }} onClick={() => handleLike(post.id)}>
      {post.is_liked ? <FaHeart /> : <FiHeart />}
        </motion.button>
        <motion.button className={` ${post.is_favorited ? styles1.favorited : ''} ${styles.saveButton}`} whileTap={{ scale: 0.9 }} onClick={() => handleFavorite(post.id)}>
          {post.is_favorited ? <FaBookmark /> : <FiBookmark />}
        </motion.button>
            </div>
      <motion.div className={styles.quickViewOverlay} initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
        <button onClick={() => { console.log(post); handlePostClick(post); }} className={styles.quickViewButton}>
          <FiEye /> Quick View
        </button>


        <button 
      onClick={() => debugPost(post.id)}
      style={{
        position: 'absolute',
        top: '5px',
        right: '5px',
        background: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        padding: '2px 6px',
        fontSize: '10px',
        cursor: 'pointer',
        zIndex: 1000,
        display: 'none'
      }}
    >
      DEBUG
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
        className={styles.disc}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        onClick={() => {
          if (post.user_id === currentUserId) {
            router.push('/newprofile');
          } else {
            router.push(`/someoneProfile/${post.user_id}`);
          }
        }}
      >
        <img src={post.profile_pic} alt={post.user} className={styles.discprofile_pic} />
        <span>@{post.user}</span>
      </motion.div>
      <div className={styles.price}>${post.design.price}</div>
      <div className={styles.cardActions}>
        <motion.button 
          className={styles.addToCartButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAddToCart(post)}
        >
          <FiShoppingCart/> Add to Cart
        </motion.button>
        <motion.button 
          className={styles.viewButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { console.log(post); handlePostClick(post); }}
        >
          <FiEye />
        </motion.button>
              </div>
                </div>
  </motion.div>
  );
})}
        </motion.div>
              </div>

      {/* Show More Button */}
      <motion.div 
        className={styles.showMoreContainer}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {backendPosts.length > 8 && (
          <motion.button 
            className={styles.showMoreButton}
            onClick={() => setShowAllBackendPosts((prev) => !prev)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <span>{showAllBackendPosts ? 'Show Less' : 'Show More Designs'}</span>
            <motion.div
              animate={{ x: showAllBackendPosts ? -4 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FiArrowRight className={showAllBackendPosts ? styles.rotateArrow : ''} />
            </motion.div>
          </motion.button>
        )}
        <motion.p 
          className={styles.showMoreText}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Showing {Math.min(visibleBackendPosts, backendPosts.length)} of {backendPosts.length} designs
        </motion.p>
      </motion.div>
    </section>



    <div className={styles.exploreFeaturedSectionWrapper}>
  <div className={styles.exploreFeaturedSection}>
    <div className={styles.exploreFeaturedDecoration}>
      <div className={styles.exploreFeaturedShape1}></div>
      <div className={styles.exploreFeaturedShape2}></div>
      <div className={styles.exploreFeaturedShape3}></div>
            </div>
    <motion.div 
      className={styles.exploreFeaturedHeader}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <h2 className={styles.exploreFeaturedSectionTitle}>Most Liked Designs</h2>
      <p className={styles.exploreFeaturedSectionSubtitle}>See what's trending. The most-liked designs from our community.</p>
    </motion.div>
    <div className={styles.exploreFeaturedSliderNav}>
      <motion.button 
        className={styles.exploreFeaturedSliderButton} 
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
        className={styles.exploreFeaturedSliderButton} 
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
      className={styles.exploreFeaturedCardsGrid} 
      ref={sliderRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
{mostLikedLoading ? (
  <div className={styles.loadingContainer}>
    <div className={styles.loadingSpinner}></div>
    <p>Loading most popular designs...</p>
                </div>
) : mostLikedError ? (
  <div className={styles.errorContainer}>
    <p>Error: {mostLikedError}</p>
    <button onClick={fetchMostLiked}>Retry</button>
              </div>
) : mostLikedData.length === 0 ? (
  <div className={styles.emptyContainer}>
    <p>No designs have been liked yet.</p>
            </div>
) : (
  mostLikedData.slice(0, 15).map((post, index) => (
    <div
      key={post.id || index}
      className={styles.exploreFeaturedCard}
     
    >
      <div className={styles.exploreFeaturedImgBack} >
        <img
          className={styles.clearW}
          src={post.design?.image_url}
          alt={post.caption || post.design?.modell || 'Untitled Design'}
          onClick={() => handlePostClick(post)}
        />
  <div
    className={styles.imageOverlay}
    onClick={e => {
      e.stopPropagation();
      handlePostClick(post);
    }}
  >

              </div>
        <div className={styles.exploreFeaturedImageStats}>
          <div className={styles.exploreFeaturedStatRow}>
            <button
              className={`${styles.exploreFeaturedStatButton} ${post.is_liked ? styles1.liked1 : ''}`}
              title="Like"
              onClick={() => handleLike(post.id)}
            >
             {post.is_liked? <FaHeart /> : <FiHeart />}
              <span className={styles.exploreFeaturedStatCount}>
                {post.like_count > 1000
                  ? `${(post.like_count / 1000).toFixed(1)}k`
                  : post.like_count}
              </span>
            </button>
            <button
              className={`${styles.exploreFeaturedStatButton} ${post.is_favorited ? styles1.favorited1 : ''}`}
              title="Save"
              onClick={() => handleFavorite(post.id)}
            >
              {post.is_favorited?  <FaBookmark /> : <FiBookmark />}
              <span className={styles.exploreFeaturedStatCount}>
                {post.favorite_count > 1000
                  ? `${(post.favorite_count / 1000).toFixed(1)}k`
                  : post.favorite_count}
              </span>
            </button>
                </div>
          <div className={styles.exploreFeaturedPrice}>${post.design?.price}</div>
              </div>
            </div>
      <div className={styles.exploreFeaturedCardsContent}>
        <h3 className={styles.exploreFeaturedTitle}>
          {post.caption || post.design?.modell || 'Untitled Design'}
        </h3>
        <div className={styles.exploreFeaturedDisc} onClick={() => {
          if (post.user_id === currentUserId) {
            router.push('/newprofile');
          } else {
            router.push(`/someoneProfile/${post.user_id}`);
          }
        }}>
          <img
            src={post.profile_pic || post.user_details?.profile_pic}
            alt="Artist"
            className={styles.exploreFeaturedDiscProfilePic}
          />
          <span>
            By {post.user_details?.username || post.user || 'Unknown'}
          </span>
              </div>
        <button
          className={styles.exploreFeaturedBtn5}
          onClick={e => {
            e.stopPropagation();
            handleAddToCart(post.design?.id);
          }}
        >
          Add to Cart
        </button>
                </div>
              </div>
  ))
)}
    </motion.div>
    {dotCount > 1 && (
  <motion.div className={styles.sliderDots}>
    {[...Array(dotCount)].map((_, index) => (
      <motion.div
        key={index}
        className={`${styles.dot} ${currentSlide === index ? styles.active : ''}`}
        onClick={() => scrollToSlide(index)}
      />
    ))}
  </motion.div>
)}
            </div>
              </div>


      

    <section className={styles.stylesSection}>
      <div className={ccardStyles.catagoryContainer}>
        {/* Decorative Shapes */}
        <div className={styles.exploreDecoration}>
          <div className={styles.exploreShape1}></div>
          <div className={styles.exploreShape2}></div>
          <div className={styles.exploreShape3}></div>
          <div className={styles.exploreShape4}></div>
          <div className={styles.exploreShape5}></div>
          <div className={styles.exploreShape6}></div>
          <div className={styles.exploreShape7}></div>
                </div>
        <motion.div 
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}><span className={styles1.highlight2}>Explore</span> by Style</h2>
          <p className={styles.sectionSubtitle}>Find your perfect design by browsing our curated style categories</p>
        </motion.div>
        <div className={ccardStyles.sliderContainer}>
          <div className={ccardStyles.sliderTrack}>
            {[...styleCategories, ...styleCategories].map((category, index) => (
              <div key={`${category.id}-${index}`} onClick={() => { router.push(`/category/${encodeURIComponent(category.name)}`); }}>
              <CategorySlideCard category={category} />
              </div>
            ))}
            </div>
              </div>
                </div>
    </section>

    
    {/* SECTION 2: Top Designers */}
    <section className={styles.designersSection}>
      <div className={styles.designerscontainer}>
        <motion.div 
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}><span className={styles1.highlight2}>Top Designers</span> This Week</h2>
          <p className={styles.sectionSubtitle}>Meet the talented artists behind our most popular designs</p>
        </motion.div>
        <div className={styles1.featuredDecoration}>
            <div className={styles1.featuredShape1}></div>
            <div className={styles1.featuredShape2}></div>
            <div className={styles1.featuredShape3}></div>
            <div className={styles1.featuredShape4}></div>
            <div className={styles1.featuredShape5}></div>
              </div>
<motion.div 
  className={styles.designersGrid}
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: 0.2 }}
>
  {topUsers.map((user, index) => (
    <motion.div
      key={user.user_id}
      className={styles1.artistCard}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
    >
      <div className={styles1.artistPreview}>
        <img src={user.profile_pic} alt={`${user.username}'s work`} />
        <div className={styles1.artistOverlay}>
          <div className={styles1.artistStats}>
            <div className={styles1.stat}>
              <span className={styles1.statValue}>{user.total_posts}</span>
              <span className={styles1.statLabel}>Posts</span>
            </div>
            <div className={styles1.stat}>
              <span className={styles1.statValue}>{user.total_likes}</span>
              <span className={styles1.statLabel}>Likes</span>
              </div>
                </div>
              </div>
            </div>
      <div className={styles1.artistContent}>
        <div className={styles1.artistHeader}>
          <img 
            src={user.profile_pic} 
            alt={user.username} 
            className={styles1.artistAvatar}
          />
          <div className={styles1.artistInfo}>
            <h3 className={styles1.artistName}>{user.first_name} {user.last_name}</h3>
            <span className={styles1.artistRole}>@{user.username}</span>
              </div>
          
                </div>
        <p className={styles1.artistDescription}>
        {designerDescriptions[index % designerDescriptions.length]}
      </p>
        {/* You can add tags or other info here if you want */}


        <button className={styles1.viewProfileBtn}   onClick={() => {
    if (user.user_id === currentUserId) {
      router.push('/newprofile');
    } else {
      router.push(`/someoneProfile/${user.user_id}`);
    }
  }}>
          View Portfolio
          <FiArrowRight />
        </button>
              </div>
    </motion.div>
  ))}
</motion.div>
            </div>
    </section>

    <section className={styles.newsletterSection}>
      <div className={styles.newsletterContainer}>
        <motion.div 
          className={styles.newsletterContent}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className={styles.newsletterTitle}>
            Your Vision, Your Masterpiece
          </h2>
          <p className={styles.newsletterSubtitle}>
            Unleash your creativity and design a one-of-a-kind phone case. It's easy, fun, and uniquely yours.
          </p>
        </motion.div>
        <motion.div
          className={styles.newsletterForm}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <motion.button 
            className={styles.newsletterButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
                const btn = e.currentTarget;
                for (let i = 0; i < 20; i++) {
                  router.push('/newdesign')
                    const sparkle = document.createElement('div');
                    sparkle.className = styles.sparkle;
                    sparkle.style.left = `${Math.random() * 100}%`;
                    sparkle.style.top = `${Math.random() * 100}%`;
                    btn.appendChild(sparkle);
                    setTimeout(() => sparkle.remove(), 1000);
                }

            }}
          >
            Start Creating Now <FiPenTool style={{ marginLeft: '8px' }} />
          </motion.button>
        </motion.div>
              </div>
    </section>

    

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
              {selectedPost.hashtag_names && selectedPost.hashtag_names.map((tag, index) => (
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
    selectedPost.comments.map((comment) => {
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



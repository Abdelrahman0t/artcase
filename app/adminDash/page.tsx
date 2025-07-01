// app/superadmin/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../fyp/layout'
import styles from './adminDash.module.css'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'
import {
  // Rubber cases
  iphone_14_t, iphone_14_plus_t, iphone_14_pro_t, iphone_14_pro_max_t,
  iphone_15_t, iphone_15_plus_t, iphone_15_pro_t, iphone_15_pro_max_t,
  iphone_16_pro_t, iphone_16_pro_max_t,
  // Clear cases
  iphone_se, iphone_7, iphone_8, iphone_12, iphone_12_mini, iphone_12_pro,
  iphone_12_pro_max, iphone_13, iphone_13_mini, iphone_13_pro, iphone_13_pro_max,
  iphone_14, iphone_14_plus, iphone_14_pro, iphone_14_pro_max,
  samsung_a34, samsung_a54, samsung_galaxy_note_8, samsung_galaxy_note_12,
  samsung_galaxy_s23, oppo_a60, oppo_reno_4z, oppo_reno_5_lite, oppo_reno_6,
  oppo_reno_12, redmi_13_pro, redmi_a3, redmi_note_12, redmi_note_11_pro,
  redmi_note_10
} from '../createclear/phons'
import { div } from 'three/webgpu'

// Types
interface Order {
  id: number
  first_name: string
  last_name: string
  email: string
  phone_number: string
  address: string
  city: string
  country: string
  price: number
  quantity: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled'
  created_at: string
  image_url: string
  modell: string
  type: string
}

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  status: 'active' | 'suspended' | 'banned'
  last_login: string
  profile_pic?: string
  post_count?: number
  like_count?: number
  comment_count?: number
}

interface Report {
  id: number;
  content_id: number;
  content_type: 'post' | 'comment';
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  reported_by: string;
  created_at: string;
  content_details?: {
    caption?: string;
    description?: string;
    content?: string;
    created_at: string;
    user: string;
    user_id: number;  // Ensure this is required for comments
    profile_pic?: string;
    image_url?: string;
    post_id?: number;
    post_caption?: string;
    post_description?: string;
    post_image_url?: string;
    post_user?: string;
    post_user_id?: number;  // Add post user ID
    post_created_at?: string;
    design__modell?: string;
    design__type?: string;
    design__price?: number;
    error?: string;
    comments?: any[];
  };
}

interface Announcement {
  id: number
  title: string
  content: string
  priority: 'low' | 'medium' | 'high'
  status: 'draft' | 'published' | 'archived'
  publish_date: string
}

interface DesignStats {
  total_designs: number;
  by_class: Array<{ theclass: string; count: number }>;
  by_model: Array<{ modell: string; count: number }>;
  by_type: Array<{ type: string; count: number }>;
  stock_status: Array<{ stock: boolean; count: number }>;
}

interface ActivityStats {
  posts_by_hour: Array<{ hour: number; count: number }>;
  orders_by_hour: Array<{ hour: number; count: number }>;
}

interface EngagementStats {
  total_likes: number;
  total_comments: number;
  total_favorites: number;
  likes_by_hour: Array<{ hour: number; count: number }>;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  username: string;
  first_name: string;
  profile_pic: string;
}

interface PhoneProduct {
  id: number;
  type: string;
  modell: string;
  stock: boolean;
  price: number;
  url: string;
}

// Update the analytics interface to match the API response
interface AnalyticsData {
  designs: {
    total_designs: number;
    by_class: Array<{ theclass: string; count: number; total_likes: number; total_posts: number }>;
    by_model: Array<{ modell: string; count: number; avg_price: number; total_revenue: number; engagement_rate: number }>;
    by_type: Array<{ type: string; count: number; total_revenue: number }>;
    stock_status: Array<{ stock: boolean; count: number }>;
  };
  posts: {
    top_liked: Array<{
      id: number;
      caption: string;
      like_count: number;
      comment_count: number;
      description: string;
      created_at: string;
      design__image_url: string;
      design__modell: string;
      design__type: string;
      design__price: number;
      user__username: string;
      user__profile_pic: string;
    }>;
    top_commented: Array<{
      id: number;
      caption: string;
      comment_count: number;
      description: string;
      created_at: string;
      design__image_url: string;
      design__modell: string;
      design__type: string;
      design__price: number;
      user__username: string;
      user__profile_pic: string;
    }>;
    top_favorited: Array<{
      id: number;
      caption: string;
      favorite_count: number;
      description: string;
      created_at: string;
      design__image_url: string;
      design__modell: string;
      design__type: string;
      design__price: number;
      user__username: string;
      user__profile_pic: string;
    }>;
    time_series: Array<{ date: string; count: number }>;
  };
  orders: {
    total_orders: number;
    total_revenue: number;
    by_model: Array<{ modell: string; quantity: number; revenue: number }>;
    by_type: Array<{ type: string; quantity: number; revenue: number }>;
    status_distribution: Array<{ status: string; count: number; revenue: number }>;
    by_location: Array<{ country: string; city: string; count: number; revenue: number }>;
  };
  users: {
    most_active: Array<{ id: number; username: string; post_count: number; like_count: number; comment_count: number }>;
    discount_eligible: Array<{ id: number; username: string; total_likes: number; total_posts: number }>;
    engagement_heatmap: Array<{ hour: number; day: number; count: number }>;
  };
  time_series: {
    designs_over_time: Array<{ date: string; count: number }>;
    engagement_over_time: Array<{ date: string; likes: number; comments: number; favorites: number }>;
  };
}

// Add this helper function at the top of the file, after imports
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'Never';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return format(date, 'PPp');
  } catch (error) {
    return 'Invalid Date';
  }
};

// Define colors for order statuses to use in charts
const orderStatusColors: { [key: string]: string } = {
  pending: '#FFB74D', // Lighter orange
  processing: '#64B5F6', // Lighter blue
  shipped: '#81C784', // Lighter green
  delivered: '#BA68C8', // Lighter purple
  canceled: '#E57373', // Lighter red
};

// Add this new component
const FilteredProducts = ({ 
  products, 
  searchTerm, 
  typeFilter, 
  modelFilter, 
  stockFilter,
  onStockChange,
  onPriceChange
}: { 
  products: PhoneProduct[],
  searchTerm: string,
  typeFilter: string,
  modelFilter: string,
  stockFilter: string,
  onStockChange: (id: number, stock: boolean) => void,
  onPriceChange: (id: number, price: number) => void
}) => {
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.modell.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || product.type === typeFilter;
    const matchesModel = modelFilter === 'all' || product.modell === modelFilter;
    const matchesStock = stockFilter === 'all' || 
                       (stockFilter === 'in' && product.stock) || 
                       (stockFilter === 'out' && !product.stock);
    
    return matchesSearch && matchesType && matchesModel && matchesStock;
  });

  const rubberCases = filteredProducts.filter(product => product.type === 'customed rubber case');
  const clearCases = filteredProducts.filter(product => product.type === 'customed clear case');

  return (
    <>
      {rubberCases.length > 0 && (
        <div className={styles.productCategory}>
          <h2>Rubber Cases</h2>
          <div className={styles.productsGrid}>
            {rubberCases.map(product => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.url} alt={`${product.modell} ${product.type}`} />
                </div>
                <div className={styles.productInfo}>
                  <h3>{product.modell}</h3>
                  <p className={styles.productType}>Rubber Case</p>
                  <div className={styles.productControls}>
                    <div className={styles.stockControl}>
                      <label>
                        <input
                          type="checkbox"
                          checked={product.stock}
                          onChange={(e) => onStockChange(product.id, e.target.checked)}
                        />
                        {product.stock ? 'In Stock' : 'Out of Stock'}
                      </label>
                    </div>
                    <div className={styles.priceControl}>
                      <label>
                        Price:
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => onPriceChange(product.id, parseFloat(e.target.value))}
                          min="0"
                          step="0.01"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {clearCases.length > 0 && (
        <div className={styles.productCategory}>
          <h2>Clear Cases</h2>
          <div className={styles.productsGrid}>
            {clearCases.map(product => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.url} alt={`${product.modell} ${product.type}`} />
                </div>
                <div className={styles.productInfo}>
                  <h3>{product.modell}</h3>
                  <p className={styles.productType}>Clear Case</p>
                  <div className={styles.productControls}>
                    <div className={styles.stockControl}>
                      <label>
                        <input
                          type="checkbox"
                          checked={product.stock}
                          onChange={(e) => onStockChange(product.id, e.target.checked)}
                        />
                        {product.stock ? 'In Stock' : 'Out of Stock'}
                      </label>
                    </div>
                    <div className={styles.priceControl}>
                      <label>
                        Price:
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => onPriceChange(product.id, parseFloat(e.target.value))}
                          min="0"
                          step="0.01"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className={styles.noProducts}>
          <i className="fas fa-search"></i>
          <p>No products found matching your criteria</p>
        </div>
      )}
    </>
  );
};

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [activeTab, setActiveTab] = useState('orders')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0
  })
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [expandedChart, setExpandedChart] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusUpdateMessage, setStatusUpdateMessage] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedPost2, setSelectedPost2] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{show: boolean, postId: number | null}>({show: false, postId: null});

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [orderIdSearchTerm, setOrderIdSearchTerm] = useState<string>('');
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [phoneProducts, setPhoneProducts] = useState<PhoneProduct[]>([]);
  const [phoneProductsError, setPhoneProductsError] = useState<string | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState('all');
  const [productModelFilter, setProductModelFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [reportFilter, setReportFilter] = useState('all');
  const [expandedReport, setExpandedReport] = useState<number | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeUserTab, setActiveUserTab] = useState('users');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [postSearchTerm, setPostSearchTerm] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [postSortFilter, setPostSortFilter] = useState('latest');
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<User['status'] | null>(null);
  const [suspensionDuration, setSuspensionDuration] = useState(1); // Default 1 day
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);

  // Initialize filtered results when component mounts
  useEffect(() => {
    if (users.length > 0) {
      setFilteredUsers(users);
    }
    if (allPosts.length > 0) {
      setFilteredPosts(allPosts);
    }
  }, [users, allPosts]);

  // Fetch data on component mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }

    // Verify admin status
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized')
        return res.json()
      })
      .then((userData) => {
        if (userData.username !== 'admin') {
          router.replace('/403')
        } else {
          setUser(userData)
          fetchAllData(token)
        }
      })
      .catch(() => {
        router.replace('/login')
      })
  }, [router])

  // Fetch analytics specifically when the analytics tab becomes active
  useEffect(() => {
    if (activeTab === 'analytics' && user) {
      const token = localStorage.getItem('token');
      if (token) {
        fetchAnalytics(token);
      }
    }
  }, [activeTab, user]); // Depend on activeTab and user

  // Fetch phone products when the phone products tab becomes active
  useEffect(() => {
    if (activeTab === 'phone-products' && user) {
      const token = localStorage.getItem('token');
      if (token) {
        fetchPhoneProducts(token);
      }
    }
  }, [activeTab, user]); // Depend on activeTab and user

  const fetchAllData = async (token: string) => {
    try {
      const [ordersRes, usersRes, reportsRes, announcementsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/all-orders/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/announcements/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ])

      const [ordersData, usersData, reportsData, announcementsData] = await Promise.all([
        ordersRes.json(),
        usersRes.json(),
        reportsRes.json(),
        announcementsRes.json()
      ])

      setOrders(ordersData)
      setUsers(usersData)
      setReports(reportsData)
      setAnnouncements(announcementsData)
      calculateOrderStats(ordersData)
      fetchAnalytics(token)
      fetchPhoneProducts(token)
      await fetchReports(token)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const calculateOrderStats = (orders: Order[]) => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length
    }
    setOrderStats(stats)
  }

  const fetchAnalytics = async (token: string) => {
    try {
      console.log('Fetching analytics...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/analytics/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const analyticsData = await response.json();
        console.log('Raw Analytics Data:', analyticsData);
        
        // Validate the data structure
        if (!analyticsData.designs || !analyticsData.posts || !analyticsData.orders) {
          console.error('Analytics data is missing required sections');
          return;
        }

        // Log each section to verify data
        console.log('Designs data:', analyticsData.designs);
        console.log('Posts data:', analyticsData.posts);
        console.log('Orders data:', analyticsData.orders);
        console.log('Users data:', analyticsData.users);
        console.log('Time series data:', analyticsData.time_series);

        setAnalytics(analyticsData);
      } else {
        console.error('Failed to fetch analytics:', response.status);
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  }

  const fetchPhoneProducts = async (token: string) => {
    try {
      console.log('Fetching phone products...');
      console.log('API URL:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/phone-products/`);
      console.log('Token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/phone-products/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch phone products: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Received phone products:', data);
      
      // If no products exist in the database, initialize with our imported products
      if (data.length === 0) {
        console.log('No products found, initializing with default products...');
        const allProducts = [
          // Rubber cases
          iphone_14_t, iphone_14_plus_t, iphone_14_pro_t, iphone_14_pro_max_t,
          iphone_15_t, iphone_15_plus_t, iphone_15_pro_t, iphone_15_pro_max_t,
          iphone_16_pro_t, iphone_16_pro_max_t,
          // Clear cases
          iphone_se, iphone_7, iphone_8, iphone_12, iphone_12_mini, iphone_12_pro,
          iphone_12_pro_max, iphone_13, iphone_13_mini, iphone_13_pro, iphone_13_pro_max,
          iphone_14, iphone_14_plus, iphone_14_pro, iphone_14_pro_max,
          samsung_a34, samsung_a54, samsung_galaxy_note_8, samsung_galaxy_note_12,
          samsung_galaxy_s23, oppo_a60, oppo_reno_4z, oppo_reno_5_lite, oppo_reno_6,
          oppo_reno_12, redmi_13_pro, redmi_a3, redmi_note_12, redmi_note_11_pro,
          redmi_note_10
        ];

        // Create products in the database
        for (const product of allProducts) {
          console.log('Creating product:', product.modell);
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/phone-products/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              type: product.type,
              modell: product.modell,
              stock: product.stock,
              price: product.price
            })
          });
        }

        // Fetch the newly created products
        console.log('Fetching newly created products...');
        const newResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/phone-products/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!newResponse.ok) {
          throw new Error('Failed to fetch newly created phone products');
        }

        const newData = await newResponse.json();
        console.log('Received newly created products:', newData);
        setPhoneProducts(newData);
      } else {
        console.log('Setting existing products:', data);
        setPhoneProducts(data);
      }
    } catch (error) {
      console.error('Error with phone products:', error);
      setPhoneProductsError('Failed to load phone products. Please try again.');
    }
  };

  const handleStockChange = async (productId: number, newStock: boolean) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/phone-products/${productId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stock: newStock  // Convert boolean to string
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update stock status');
      }

      // Update the local state
      setPhoneProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId
            ? { ...product, stock: newStock }
            : product
        )
      );
    } catch (error) {
      console.error('Error updating stock:', error);
      setPhoneProductsError('Failed to update stock status. Please try again.');
    }
  };

  const handlePriceChange = async (productId: number, newPrice: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/phone-products/${productId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          price: newPrice
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update price');
      }

      // Update the local state
      setPhoneProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId
            ? { ...product, price: newPrice }
            : product
        )
      );
    } catch (error) {
      console.error('Error updating price:', error);
      setPhoneProductsError('Failed to update price. Please try again.');
    }
  };

  // Add this function to handle date range changes
  const handleDateRangeChange = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const params = new URLSearchParams()
      if (dateRange.start) params.append('start_date', dateRange.start)
      if (dateRange.end) params.append('end_date', dateRange.end)

      console.log('Fetching analytics with date range:', dateRange);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/analytics/?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.ok) {
        const analyticsData = await response.json()
        console.log('Received filtered analytics data:', analyticsData);

        // Only update the designs.by_class part of the analytics state
        setAnalytics(prevAnalytics => {
          if (!prevAnalytics) return null; // Return null if previous state is null

          return {
            ...prevAnalytics,
            designs: {
              ...prevAnalytics.designs,
              by_class: analyticsData.designs.by_class,
              // Ensure other properties are carried over or handled if they are in analyticsData
              total_designs: analyticsData.designs.total_designs !== undefined ? analyticsData.designs.total_designs : prevAnalytics.designs?.total_designs,
              by_model: analyticsData.designs.by_model !== undefined ? analyticsData.designs.by_model : prevAnalytics.designs?.by_model,
              by_type: analyticsData.designs.by_type !== undefined ? analyticsData.designs.by_type : prevAnalytics.designs?.by_type,
              stock_status: analyticsData.designs.stock_status !== undefined ? analyticsData.designs.stock_status : prevAnalytics.designs?.stock_status,
            }
          };
        });

      } else {
        console.error('Failed to fetch analytics with date range:', response.status);
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error fetching analytics with date range:', error)
    }
  }

  // Add useEffect to handle date range changes
  useEffect(() => {
    if (dateRange.start || dateRange.end) {
      handleDateRangeChange()
    }
  }, [dateRange])

  const handleUnauthorized = () => {
    router.push('/login')
  }

  const fetchReports = async (token: string) => {
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (contentTypeFilter !== 'all') queryParams.append('content_type', contentTypeFilter.toLowerCase());
      if (searchTerm) queryParams.append('search', searchTerm);
      queryParams.append('ordering', sortOrder === 'latest' ? '-post_id' : 'post_id');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports/?${queryParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else if (response.status === 401) {
        handleUnauthorized();
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  // Add useEffect to refetch reports when filters change
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchReports(token);
    }
  }, [statusFilter, contentTypeFilter, searchTerm, sortOrder]);

  const handleOrderStatusUpdate = async (orderId: number, newStatus: Order['status']) => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${orderId}/status/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update the orders list with the new status
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        
        // Update the selectedOrder with the new status
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }

        // Show success message
        setStatusUpdateMessage('Order status updated successfully');
        setTimeout(() => setStatusUpdateMessage(''), 3000);
      } else {
        const data = await response.json();
        setStatusUpdateMessage(data.error || 'Failed to update order status');
        setTimeout(() => setStatusUpdateMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setStatusUpdateMessage('Failed to update order status');
      setTimeout(() => setStatusUpdateMessage(''), 3000);
    }
  };

  const handleUserStatusUpdate = async (userId: number, newStatus: User['status']) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userId}/status/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          status: newStatus,
          suspension_duration: newStatus === 'suspended' ? suspensionDuration : null 
        }),
      })

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        ))
        setShowConfirmModal(false)
        setSelectedUser(null)
        setSelectedStatus(null)
        setSuspensionDuration(1)
      }
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const handleStatusChange = (user: User, newStatus: User['status']) => {
    setSelectedUser(user)
    setSelectedStatus(newStatus)
    setShowConfirmModal(true)
  }

  const handleReportAction = async (reportId: number, action: 'resolve' | 'dismiss') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports/${reportId}/status/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        // Refresh the reports list
        fetchReports(token);
      } else {
        const data = await response.json();
        alert(data.detail || 'Failed to update report status');
      }
    } catch (error) {
      console.error('Error updating report status:', error);
      alert('Error updating report status');
    }
  };

  const handleAnnouncementPublish = async (announcementId: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/announcements/${announcementId}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setAnnouncements(announcements.map(announcement => 
          announcement.id === announcementId ? { ...announcement, status: 'published' } : announcement
        ))
      }
    } catch (error) {
      console.error('Error publishing announcement:', error)
    }
  }

  const handleChartClick = (chartId: string) => {
    setExpandedChart(expandedChart === chartId ? null : chartId);
  };

  const handleCloseChart = () => {
    setExpandedChart(null);
  };

  const handleProfileClick = () => {
    router.push('/profile')
  }

  const handleHomeClick = () => {
    router.push('/fyp');
  };

  // Add this function to filter orders
  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' ? true : order.status === statusFilter
  );

  // Add this function to count orders by status
  const getOrderCountByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status).length;
  };

  const sortOrders = (orders: Order[]) => {
    return [...orders].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });
  };

  const handleSort = (order: 'latest' | 'oldest') => {
    setSortOrder(order);
  };

  // Add this function to filter orders by ID
  const filterOrdersById = (orders: Order[], searchTerm: string) => {
    if (!searchTerm) return orders; // Return all orders if search term is empty
    return orders.filter(order => order.id.toString().includes(searchTerm));
  };

  const handlePostClick = async (post: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleUnauthorized();
        return;
      }

      // First fetch post details to get engagement metrics
      const postResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${post.id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!postResponse.ok) {
        throw new Error('Failed to fetch post details');
      }

      const postDetails = await postResponse.json();
      
      // Update post with engagement metrics and ensure design data exists
      const postWithMetrics = {
        ...post,
        user__id: postDetails.user_id,
        user__username: postDetails.user,
        like_count: postDetails.like_count || 0,
        comment_count: postDetails.comment_count || 0,
        favorite_count: postDetails.favorite_count || 0,
        design: post.design ? {
          ...post.design,
          image_url: post.design.image_url || '',
          modell: post.design.modell || '',
          type: post.design.type || '',
          price: post.design.price || 0,
          stock: post.design.stock || false,
          theclass: post.design.theclass || ''
        } : {
          image_url: '',
          modell: '',
          type: '',
          price: 0,
          stock: false,
          theclass: ''
        }
      };

      setSelectedPost(postWithMetrics);
      setCommentLoading(true);
      setCommentError(null);

      // Then fetch comments
      const commentsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${post.id}/comments/`);
      if (!commentsResponse.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await commentsResponse.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Error fetching post details:', error);
      setCommentError('Failed to load post details. Please try again.');
      setComments([]);
    } finally {
      setCommentLoading(false);
    }
  };

  const handlePostClick2 = async (post: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleUnauthorized();
        return;
      }

      // First fetch post details to get engagement metrics
      const postResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${post.id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!postResponse.ok) {
        throw new Error('Failed to fetch post details');
      }

      const postDetails = await postResponse.json();
      
      // Update post with engagement metrics and ensure design data exists
      const postWithMetrics = {
        ...post,

        user_username: postDetails.user_username,

        user__id: postDetails.user_id,
        like_count: postDetails.like_count || 0,
        comment_count: postDetails.comment_count || 0,
        favorite_count: postDetails.favorite_count || 0,
        design: post.design ? {
          ...post.design,
          image_url: post.design.image_url || '',
          modell: post.design.modell || '',
          type: post.design.type || '',
          price: post.design.price || 0,
          stock: post.design.stock || false,
          theclass: post.design.theclass || ''
        } : {
          image_url: '',
          modell: '',
          type: '',
          price: 0,
          stock: false,
          theclass: ''
        }
      };

      setSelectedPost2(postWithMetrics);
      setCommentLoading(true);
      setCommentError(null);

      // Then fetch comments
      const commentsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${post.id}/comments/`);
      if (!commentsResponse.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await commentsResponse.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Error fetching post details:', error);
      setCommentError('Failed to load post details. Please try again.');
      setComments([]);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${postId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      // Close the modal and refresh the posts list
      setSelectedPost(null);
      setSelectedPost2(null);
      setSelectedUser(null);
      setDeleteConfirmation({show: false, postId: null});
      fetchAllPosts(token);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const confirmDelete = (postId: number) => {
    setDeleteConfirmation({show: true, postId});
  };

  const cancelDelete = () => {
    setDeleteConfirmation({show: false, postId: null});
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleUnauthorized();
        return;
      }

      // Immediately update the UI to show the comment as deleted
      setSelectedReport(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          content_details: {
            ...prev.content_details!,
            content: '[Deleted]',
            error: 'Content has been deleted'
          }
        };
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/${commentId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // If deletion fails, revert the UI change
        setSelectedReport(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            content_details: {
              ...prev.content_details!,
              content: prev.content_details!.content,
              error: undefined
            }
          };
        });
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete comment');
      }

      // Comment deleted successfully
      console.log('Comment deleted successfully.');

      // Update the reports list to reflect the deletion
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === selectedReport?.id 
            ? {
                ...report,
                content_details: {
                  ...report.content_details!,
                  content: '[Deleted]',
                  error: 'Content has been deleted'
                }
              }
            : report
        )
      );

    } catch (error: any) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. ' + error.message);
    }
  };

  const handleDeleteCommentOptimistic = async (commentId: number) => {
    // Show confirmation dialog
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    // Optimistically remove the comment from the UI
    setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/${commentId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // If the API call fails, revert the optimistic update
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete comment');
      }

      // Show success message
      
    } catch (error) {
      // Revert the optimistic update on error
      setComments(prevComments => [...prevComments]);
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleDeleteReportCommentOptimistic = async (commentId: number) => {
    // Show confirmation dialog
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    // Store the original state in case we need to revert
    const originalReport = selectedReport;
    
    // Optimistically remove the comment from the UI
    if (selectedReport?.content_details?.comments) {
      const updatedComments = selectedReport.content_details.comments.filter(comment => comment.id !== commentId);
      setSelectedReport({
        ...selectedReport,
        content_details: {
          ...selectedReport.content_details,
          comments: updatedComments
        }
      });
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/${commentId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // If the API call fails, revert the optimistic update
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete comment');
      }

      // Show success message
      
    } catch (error) {
      // Revert the optimistic update on error
      if (originalReport) {
        setSelectedReport(originalReport);
      }
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleDeleteReportPost = async (postId: number) => {
    console.log('Attempting to delete post:', postId);
    if (!postId) {
      console.log('No post ID provided');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this post?')) {
      console.log('Delete cancelled by user');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        handleUnauthorized();
        return;
      }

      console.log('Making delete request for post:', postId);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${postId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Delete request failed:', errorData);
        throw new Error(errorData.detail || 'Failed to delete post');
      }

      // Post deleted successfully
      console.log('Post deleted successfully');
      
      // Close the report modal
      setSelectedReport(null);

      // Refresh the reports list
      console.log('Refreshing reports list');
      const reportsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json();
        setReports(reportsData);
      }
    } catch (error: any) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. ' + error.message);
    }
  };

  const handleReportClick = async (report: Report) => {
    setSelectedReport(report);
    if (report.status === 'pending') {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports/${report.id}/status/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ action: 'dismiss' })
        });

        if (response.ok) {
          const updatedReport = await response.json();
          setReports(reports.map(r => r.id === report.id ? updatedReport : r));
        }
      } catch (error) {
        console.error('Error updating report status:', error);
      }
    }
  };

  const handleUserClick = async (user: User) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleUnauthorized();
        return;
      }

      setSelectedUser(user);
      setIsUserModalOpen(true);

      // Fetch user posts
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${user.id}/posts/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user posts');
      }

      const data = await response.json();
      console.log('User posts data:', data); // Debug log
      setUserPosts(data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setUserPosts([]);
    }
  };

  // Add this near your other JSX, before the closing return statement
  const UserDetailsModal = ({ user, posts, onClose }: { user: User, posts: any[], onClose: () => void }) => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    return (
      <div className={styles.usersModalOverlay}>
        <div className={styles.usersModalContent}>
          <div className={styles.usersModalHeader}>
            <h3 className={styles.usersModalTitle}>User Details</h3>
            <button className={styles.usersModalCloseButton} onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className={styles.usersModalBody}>
            <div className={styles.usersModalInfo}>
              <img 
                src={user.profile_pic || '/default-avatar.png'} 
                alt={user.username} 
                className={styles.usersModalAvatar}
              />
              <div className={styles.usersModalDetails}>
                <div className={styles.usersModalNames}>
                  <h2 className={styles.usersModalName} style={{'color': 'var(--thirdColor)'}}>@{user.username}</h2>
                  <p className={styles.usersModalEmail}>{user.first_name} {user.last_name}</p>
                </div>
              </div>
              <div className={styles.usersModalRight}>
                <p className={styles.usersModalEmail}>Email : {user.email}</p>
                {user.username !== 'admin' && (
  <select
    className={`${styles.usersModalStatus} ${
      user.status === 'active' ? styles.usersPageStatusActive :
      user.status === 'suspended' ? styles.usersPageStatusSuspended :
      styles.usersPageStatusBanned
    }`}
    value={user.status}
    onChange={(e) => {
      setSelectedUser(user);
      setSelectedStatus(e.target.value as User['status']);
      setShowConfirmModal(true);
    }}
  >
    <option value="active">Active</option>
    <option value="suspended">Suspended</option>
    <option value="banned">Banned</option>
  </select>
)}

              </div>
            </div>

            <div className={styles.usersModalStats}>
              <div className={styles.usersModalStat}>
                <i className="fas fa-image"></i>
                <span className={styles.usersModalStatValue}>
                  {analytics?.users.most_active.find(u => u.id === user.id)?.post_count || 0}
                </span>
                <span className={styles.usersModalStatLabel}>Posts</span>
              </div>
              <div className={styles.usersModalStat}>
                <i className="fas fa-heart"></i>
                <span className={styles.usersModalStatValue}>
                  {analytics?.users.most_active.find(u => u.id === user.id)?.like_count || 0}
                </span>
                <span className={styles.usersModalStatLabel}>Likes</span>
              </div>
              <div className={styles.usersModalStat}>
                <i className="fas fa-comment"></i>
                <span className={styles.usersModalStatValue}>
                  {analytics?.users.most_active.find(u => u.id === user.id)?.comment_count || 0}
                </span>
                <span className={styles.usersModalStatLabel}>Comments</span>
              </div>
            </div>

            <div className={styles.usersModalPosts}>
              {userPosts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id} className={styles.usersModalPost}>
                    <div className={styles.postImageContainer}>
                      <img
                        src={post.design.image_url}
                        alt={post.caption}
                        className={`${styles.postImage2} ${post.design__type === 'customed rubber case' ? styles.rubberCase : ''}`}
                      />
                    </div>
                    <div className={styles.postContent}>
                      <p className={styles.postCaption}>{post.caption}</p>
                      <div className={styles.postMeta}>
                        <div className={styles.postStats}>
                          <span className={styles.postStat}>
                            <i className="fas fa-heart"></i> {post.like_count || 0}
                          </span>
                          <span className={styles.postStat}>
                            <i className="fas fa-comment"></i> {post.comment_count || 0}
                          </span>
                        </div>
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                    <div className={styles.postActions}>
                      <button 
                        className={`${styles.postActionButton} ${styles.viewButton}`}
                        onClick={() =>{ console.log(post);handlePostClick2(post)}}
                      >
                        <i className="fas fa-eye"></i> View
                      </button>
                      <button 
                        className={`${styles.postActionButton} ${styles.deleteButton}`}
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                            handleDeletePost(post.id);
                          }
                        }}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.reportNoComments}>
                  <i className="far fa-image"></i>
                  <p>No posts yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add the confirmation modal component
  const StatusConfirmationModal = () => {
    if (!showConfirmModal || !selectedUser || !selectedStatus) return null;

    const getActionText = () => {
      switch (selectedStatus) {
        case 'active':
          return 'activate';
        case 'suspended':
          return 'suspend';
        case 'banned':
          return 'ban';
        default:
          return selectedStatus;
      }
    };

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.confrmmodalContent}>
          <h3>Confirm Status Change</h3>
          <p>
            Are you sure you want to {getActionText()} user{" "}
            <strong>{selectedUser.username}</strong>?
          </p>
          
          {selectedStatus === 'suspended' && (
            <div className={styles.suspensionDuration}>
              <label htmlFor="duration">Suspension Duration (days):</label>
              <input
                type="number"
                id="duration"
                min="1"
                max="365"
                value={suspensionDuration}
                onChange={(e) => setSuspensionDuration(parseInt(e.target.value))}
              />
            </div>
          )}

          <div className={styles.confrmmodalActions}>
            <button 
              className={styles.cancelButton}
              onClick={() => {
                setShowConfirmModal(false)
                setSelectedUser(null)
                setSelectedStatus(null)
                setSuspensionDuration(1)
              }}
            >
              Cancel
            </button>
            <button 
              className={styles.confirmButton}
              onClick={() => handleUserStatusUpdate(selectedUser.id, selectedStatus)}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  const fetchAllPosts = async (token: string) => {
    try {
      setLoadingPosts(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/all/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setAllPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchAllPosts(token);
    }
  }, []);

  // Initialize filtered posts when component mounts or allPosts changes
  useEffect(() => {
    if (allPosts.length > 0) {
      console.log('Initializing filtered posts');
      let sorted = [...allPosts];
      switch (postSortFilter) {
        case 'latest':
          sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case 'most_liked':
          sorted.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
          break;
        case 'most_commented':
          sorted.sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0));
          break;
      }
      setFilteredPosts(sorted);
    }
  }, [allPosts, postSortFilter]);

  // Add this to your existing JSX where you want to display the posts
  const renderPostsSection = () => {
    if (loadingPosts) {
      return (
        <div className={styles.loading}>
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading posts...</p>
        </div>
      );
    }

    if (!allPosts || allPosts.length === 0) {
      return (
        <div className={styles.noPosts}>
          <i className="fas fa-image"></i>
          <p>No posts found</p>
        </div>
      );
    }

    return (
      <div className={styles.postsGrid}>
        {allPosts.map((post) => (
          <div key={post.id} className={styles.postCard}>
            <div className={styles.postImageContainer}>
              <img 
                src={post.design__image_url} 
                alt={post.caption}
                className={`${styles.postImage2} ${post.design__type === 'rubber case' ? styles.rubberCase : ''}`}
              />
            </div>
            <div className={styles.postContent}>
              <p className={styles.postCaption}>{post.caption}</p>
              <div className={styles.postUser2}>
                <img src={post.user__profile_pic} alt={post.user__username} />
                <p>{post.user__username}</p>
              </div>
              <div className={styles.postMeta}>
                <div className={styles.postStats}>
                  <div className={styles.postStat}>
                    <i className="fas fa-heart"></i>
                    <span>{post.like_count}</span>
                  </div>
                  <div className={styles.postStat}>
                    <i className="fas fa-comment"></i>
                    <span>{post.comment_count || 0}</span>
                  </div>
                  <div className={styles.postStat}>
                    <i className="fas fa-bookmark"></i>
                    <span>{post.favorite_count || 0}</span>
                  </div>
                </div>
                <div className={styles.postActions}>
                  <button 
                    className={`${styles.postActionButton} ${styles.viewButton}`}
                    onClick={() => handlePostClick(post)}
                  >
                    <i className="fas fa-eye"></i> View
                  </button>
                  <button 
                    className={`${styles.postActionButton} ${styles.deleteButton}`}
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                        handleDeletePost(post.id);
                      }
                    }}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <>
      <div className={styles.dashboard}>
        <nav className={styles.sidebar}>
          <div className={styles.sidebarTitle}>DASHBOARD</div>
          <button 
            className={`${styles.navButton} ${activeTab === 'orders' ? styles.active : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Orders
          </button>
          <button 
            className={`${styles.navButton} ${activeTab === 'analytics' ? styles.active : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Analytics
          </button>
          <button 
            className={`${styles.navButton} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Users & Posts
          </button>
          <button 
            className={`${styles.navButton} ${activeTab === 'reports' ? styles.active : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Reports
          </button>
          {/*
          <button 
            className={`${styles.navButton} ${activeTab === 'announcements' ? styles.active : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Announcements
          </button>
          */} 
          <button 
            className={`${styles.navButton} ${activeTab === 'phone-products' ? styles.active : ''}`}
            onClick={() => setActiveTab('phone-products')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Products 
          </button>
          <button className={styles.homeButton} onClick={handleHomeClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Home
          </button>
          <button className={styles.profileButton} onClick={handleProfileClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M16 7a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Profile
          </button>
        </nav>

        <main className={styles.mainContent}>
          {activeTab === 'orders' && (
            <div className={styles.ordersSection}>
              <h2>Orders</h2>
              <div className={styles.orderStats}>
                <div 
                  className={`${styles.statCard} ${statusFilter === 'all' ? styles.active : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  <h3>Total Orders</h3>
                  <p>{orders.length}</p>
                </div>
                <div 
                  className={`${styles.statCard} ${statusFilter === 'pending' ? styles.active : ''}`}
                  onClick={() => setStatusFilter('pending')}
                >
                  <h3>Pending</h3>
                  <p>{getOrderCountByStatus('pending')}</p>
                </div>
                <div 
                  className={`${styles.statCard} ${statusFilter === 'processing' ? styles.active : ''}`}
                  onClick={() => setStatusFilter('processing')}
                >
                  <h3>Processing</h3>
                  <p>{getOrderCountByStatus('processing')}</p>
                </div>
                <div 
                  className={`${styles.statCard} ${statusFilter === 'shipped' ? styles.active : ''}`}
                  onClick={() => setStatusFilter('shipped')}
                >
                  <h3>Shipped</h3>
                  <p>{getOrderCountByStatus('shipped')}</p>
                </div>
                <div 
                  className={`${styles.statCard} ${statusFilter === 'delivered' ? styles.active : ''}`}
                  onClick={() => setStatusFilter('delivered')}
                >
                  <h3>Delivered</h3>
                  <p>{getOrderCountByStatus('delivered')}</p>
                </div>
                <div 
                  className={`${styles.statCard} ${statusFilter === 'canceled' ? styles.active : ''}`}
                  onClick={() => setStatusFilter('canceled')}
                >
                  <h3>Canceled</h3>
                  <p>{getOrderCountByStatus('canceled')}</p>
                </div>
              </div>
              <div className={styles.sortControls}>
                <button 
                  className={`${styles.sortButton} ${sortOrder === 'latest' ? styles.active : ''}`}
                  onClick={() => handleSort('latest')}
                >
                  Latest
                </button>
                <button 
                  className={`${styles.sortButton} ${sortOrder === 'oldest' ? styles.active : ''}`}
                  onClick={() => handleSort('oldest')}
                >
                  Oldest
                </button>
                <input
                  type="text"
                  placeholder="Search by Order ID"
                  value={orderIdSearchTerm}
                  onChange={(e) => setOrderIdSearchTerm(e.target.value)}
                  className={styles.orderSearchInput}
                />
              </div>
              <div className={styles.ordersTable}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.tableHeader}>Order ID</th>
                      <th className={styles.tableHeader}>Date</th>
                      <th className={styles.tableHeader}>Customer</th>
                      <th className={styles.tableHeader}>Email</th>
                      <th className={styles.tableHeader}>Total Price</th>
                      <th className={styles.tableHeader}>Status</th>
                      <th className={styles.tableHeader}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortOrders(filterOrdersById(filteredOrders, orderIdSearchTerm)).map((order) => (
                      <tr key={order.id} className={styles.tableRow}>
                        <td className={styles.tableCell}>#{order.id}</td>
                        <td className={styles.tableCell}>{formatDate(order.created_at)}</td>
                        <td className={styles.tableCell}>{order.first_name} {order.last_name}</td>
                        <td className={styles.tableCell}>{order.email}</td>
                        <td className={styles.tableCell}>${order.price * order.quantity}</td>
                        <td className={styles.tableCell}>
                          <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <button
                            className={styles.detailsButton}
                            onClick={() => setSelectedOrder(order)}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className={styles.analyticsSection}>
              <h2>Analytics Dashboard</h2>
              <div className={styles.charts}>
                
                {/* Revenue Overview */}
                <div 
                  className={`${styles.chartContainer} ${expandedChart === 'revenue' ? styles.expanded : ''}`}
                  onClick={() => setExpandedChart('revenue')}
                >
                  {expandedChart === 'revenue' && (
                    <button className={styles.closeButton} onClick={(e) => {
                      e.stopPropagation();
                      setExpandedChart(null);
                    }}>×</button>
                  )}
                  <h3>Revenue Overview</h3>
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <h4>Total Revenue</h4>
                      <p>${analytics?.orders.total_revenue.toFixed(2)}</p>
                    </div>
                    <div className={styles.statCard}>
                      <h4>Total Orders</h4>
                      <p>{analytics?.orders.total_orders}</p>
                    </div>
                  </div>
                </div>

                {/* Design Class Distribution with Engagement */}
                <div 
                  className={`${styles.chartContainer} ${expandedChart === 'design-class' ? styles.expanded : ''}`}
                  onClick={() => setExpandedChart('design-class')}
                >
                  {expandedChart === 'design-class' && (
                    <button className={styles.closeButton} onClick={(e) => {
                      e.stopPropagation();
                      setExpandedChart(null);
                    }}>×</button>
                  )}
                  <h3>Design Distribution by Class</h3>

                  {expandedChart === 'design-class' && (
                    <div className={styles.chartContent}>

                    </div>
                  )}

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={(() => {
    const selectedClasses = ['Anime & Manga', 'Cartoons & Animated Characters', 'Motivational & Inspirational', 'Funny & Meme-Based'];
    const allClassData = analytics?.designs.by_class || [];

    const filteredData = allClassData.filter(item => 
      selectedClasses.includes(item.theclass)
    );

    const otherData = allClassData.filter(item => 
      !selectedClasses.includes(item.theclass)
    );

    const othersEntry = otherData.reduce((acc, curr) => {
      acc.count += curr.count;
      acc.total_posts += curr.total_posts;
      return acc;
    }, { theclass: 'Others', count: 0, total_likes: 0, total_posts: 0 });

    const finalData = [...filteredData];
    if (otherData.length > 0) {
      finalData.push(othersEntry);
    }

    return finalData;
  })()}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="theclass" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="count" name="Total Designs" fill="#8884d8" />
    <Bar dataKey="total_posts" name="Total Posts" fill="#82ca9d" />
  </BarChart>
</ResponsiveContainer>

                </div>

                {/* Model Performance */}
                <div 
                  className={`${styles.chartContainer} ${expandedChart === 'model-performance' ? styles.expanded : ''}`}
                  onClick={() => setExpandedChart('model-performance')}
                >
                  {expandedChart === 'model-performance' && (
                    <button className={styles.closeButton} onClick={(e) => {
                      e.stopPropagation();
                      setExpandedChart(null);
                    }}>×</button>
                  )}
                  <h3>Model Performance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics?.designs.by_model}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="modell" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="count" name="Total Designs" fill="#8884d8" />
                      <Bar yAxisId="left" dataKey="order_count" name="Orders" fill="#ffc658" />
                      <Bar yAxisId="right" dataKey="total_revenue" name="Revenue" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Performing Posts */}
                <div 
                  className={`${styles.chartContainer} ${expandedChart === 'top-posts' ? styles.expanded : ''}`}
                  onClick={() => setExpandedChart('top-posts')}
                >
                  {expandedChart === 'top-posts' && (
                    <button className={styles.closeButton} onClick={(e) => {
                      e.stopPropagation();
                      setExpandedChart(null);
                    }}>×</button>
                  )}
                  <h3>Top Performing Posts</h3>
                  <div className={styles.topPostsGrid}>
                    <div>
                      <h4>Most Liked</h4>
                      {analytics?.posts?.top_liked
                        .slice(0, expandedChart === 'top-posts' ? undefined : 3)
                        .map(post => (
                          <div 
                            key={post.id} 
                            className={styles.topPostItem}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePostClick(post);
                            }}
                          >
                            <p>{post.caption}</p>
                            <span>{post.like_count} likes</span>
                          </div>
                        ))}
                      {!expandedChart && analytics?.posts?.top_liked && analytics.posts.top_liked.length > 3 && (
                        <div className={styles.viewMore}>
                          <span>+{analytics.posts.top_liked.length - 3} more</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4>Most Commented</h4>
                      {analytics?.posts?.top_commented
                        .slice(0, expandedChart === 'top-posts' ? undefined : 3)
                        .map(post => (
                          <div 
                            key={post.id} 
                            className={styles.topPostItem}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePostClick(post);
                            }}
                          >
                            <p>{post.caption}</p>
                            <span>{post.comment_count} comments</span>
                          </div>
                        ))}
                      {!expandedChart && analytics?.posts?.top_commented && analytics.posts.top_commented.length > 3 && (
                        <div className={styles.viewMore}>
                          <span>+{analytics.posts.top_commented.length - 3} more</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4>Most Favorited</h4>
                      {analytics?.posts?.top_favorited
                        .slice(0, expandedChart === 'top-posts' ? undefined : 3)
                        .map(post => (
                          <div 
                            key={post.id} 
                            className={styles.topPostItem}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePostClick(post);
                            }}
                          >
                            <p>{post.caption}</p>
                            <span>{post.favorite_count} favorites</span>
                          </div>
                        ))}
                      {!expandedChart && analytics?.posts?.top_favorited && analytics.posts.top_favorited.length > 3 && (
                        <div className={styles.viewMore}>
                          <span>+{analytics.posts.top_favorited.length - 3} more</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Engagement Over Time */}
                <div 
                  className={`${styles.chartContainer} ${expandedChart === 'engagement' ? styles.expanded : ''}`}
                  onClick={() => setExpandedChart('engagement')}
                >
                  {expandedChart === 'engagement' && (
                    <button className={styles.closeButton} onClick={(e) => {
                      e.stopPropagation();
                      setExpandedChart(null);
                    }}>×</button>
                  )}
                  <h3>Engagement Over Time</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics?.time_series.engagement_over_time}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="likes" name="Likes" stroke="#8884d8" />
                      <Line type="monotone" dataKey="comments" name="Comments" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="favorites" name="Favorites" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Order Status Distribution */}
                <div 
                  className={`${styles.chartContainer} ${expandedChart === 'order-status' ? styles.expanded : ''}`}
                  onClick={() => setExpandedChart('order-status')}
                >
                  {expandedChart === 'order-status' && (
                    <button className={styles.closeButton} onClick={(e) => {
                      e.stopPropagation();
                      setExpandedChart(null);
                    }}>×</button>
                  )}
                  <h3>Order Status Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics?.orders.status_distribution}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {analytics?.orders.status_distribution?.map((entry) => (
                          // Use the color from the orderStatusColors object
                          <Cell key={`cell-${entry.status}`} fill={orderStatusColors[entry.status]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Locations */}
                <div 
                  className={`${styles.chartContainer} ${expandedChart === 'locations' ? styles.expanded : ''}`}
                  onClick={() => setExpandedChart('locations')}
                >
                  {expandedChart === 'locations' && (
                    <button className={styles.closeButton} onClick={(e) => {
                      e.stopPropagation();
                      setExpandedChart(null);
                    }}>×</button>
                  )}
                  <h3>Top Order Locations</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics?.orders.by_location}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="city" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Orders" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Most Active Users */}
                <div 
                  className={`${styles.chartContainer} ${expandedChart === 'active-users' ? styles.expanded : ''}`}
                  onClick={() => setExpandedChart('active-users')}
                >
                  {expandedChart === 'active-users' && (
                    <button className={styles.closeButton} onClick={(e) => {
                      e.stopPropagation();
                      setExpandedChart(null);
                    }}>×</button>
                  )}
                  <h3>Most Active Users</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics?.users.most_active}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="username" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="post_count" name="Posts" fill="#8884d8" />
                      <Bar dataKey="like_count" name="Likes" fill="#82ca9d" />
                      <Bar dataKey="comment_count" name="Comments" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>  
                </div>  
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className={styles.usersPageContainer}>
              <div className={styles.usersPageHeader}>
                <h2 className={styles.usersPageTitle}>Users & Posts</h2>
                <div className={styles.usersPageControls}>
                  <button 
                    className={`${styles.usersPageActionButton} ${activeUserTab === 'users' ? styles.active : ''}`}
                    onClick={() => setActiveUserTab('users')}
                  >
                    <i className="fas fa-users"></i>
                    Users
                  </button>
                  <button 
                    className={`${styles.usersPageActionButton} ${activeUserTab === 'posts' ? styles.active : ''}`}
                    onClick={() => setActiveUserTab('posts')}
                  >
                    <i className="fas fa-image"></i>
                    Posts
                  </button>
                </div>
              </div>

              <div className={styles.usersPageControls}>
                {activeUserTab === 'users' ? (
                  <div className={styles.usersPageSearch}>
                    <input
                      type="text"
                      className={styles.usersPageSearchInput}
                      placeholder="Search users..."
                      value={userSearchTerm}
                      onChange={(e) => {
                        setUserSearchTerm(e.target.value);
                        const filtered = users.filter(user => 
                          user.username.toLowerCase().includes(e.target.value.toLowerCase()) ||
                          user.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
                          `${user.first_name} ${user.last_name}`.toLowerCase().includes(e.target.value.toLowerCase())
                        );
                        setFilteredUsers(filtered);
                      }}
                    />
                    <i className={`fas fa-search ${styles.usersPageSearchIcon}`}></i>
                  </div>
                ) : (
                  <div className={styles.usersPageSearch}>
                    <input
                      type="text"
                      className={styles.usersPageSearchInput}
                      placeholder="Search posts..."
                      value={postSearchTerm}
                      onChange={(e) => {
                        setPostSearchTerm(e.target.value);
                        let filtered = [...allPosts];
                        // Apply search filter
                        if (e.target.value) {
                          filtered = filtered.filter(post => 
                            post.caption.toLowerCase().includes(e.target.value.toLowerCase()) ||
                            post.description?.toLowerCase().includes(e.target.value.toLowerCase()) ||
                            post.user__username.toLowerCase().includes(e.target.value.toLowerCase())
                          );
                        }
                        // Apply sort order
                        switch (postSortFilter) {
                          case 'latest':
                            filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                            break;
                          case 'most_liked':
                            filtered.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
                            break;
                          case 'most_commented':
                            filtered.sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0));
                            break;
                        }
                        setFilteredPosts(filtered);
                      }}
                    />
                    <i className={`fas fa-search ${styles.usersPageSearchIcon}`}></i>
                  </div>
                )}
                <select
                  value={activeUserTab === 'users' ? userStatusFilter : postSortFilter}
                  onChange={(e) => {
                    if (activeUserTab === 'users') {
                      const value = e.target.value;
                      setUserStatusFilter(value);
                      const filtered = value === 'all' 
                        ? users 
                        : users.filter(user => user.status === value);
                      setFilteredUsers(filtered);
                    } else {
                      const value = e.target.value;
                      setPostSortFilter(value);
                      
                      
                      // Create a new array to avoid mutating the original
                      const postsToSort = [...allPosts];
                      
                      // Sort based on the selected value
                      if (value === 'latest') {
                        postsToSort.sort((a, b) => {
                          const dateA = new Date(a.created_at).getTime();
                          const dateB = new Date(b.created_at).getTime();
                          return dateB - dateA;
                        });
                      } else if (value === 'most_liked') {
                        postsToSort.sort((a, b) => {
                          const likesA = a.like_count || 0;
                          const likesB = b.like_count || 0;
                          return likesB - likesA;
                        });
                      } else if (value === 'most_commented') {
                        postsToSort.sort((a, b) => {
                          const commentsA = a.comment_count || 0;
                          const commentsB = b.comment_count || 0;
                          return commentsB - commentsA;
                        });
                      }
                      
                      // Update the filtered posts
                      setFilteredPosts(postsToSort);
                    }
                  }}
                  className={styles.usersPageFilter}
                >
                  {activeUserTab === 'users' ? (
                    <>
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="banned">Banned</option>
                    </>
                  ) : (
                    <>
                      <option value="latest">Latest</option>
                      <option value="most_liked">Most Liked</option>
                      <option value="most_commented">Most Commented</option>
                    </>
                  )}
                </select>
              </div>

              {activeUserTab === 'users' ? (
                <div className={styles.usersPageGrid}>
                  {filteredUsers.filter(user => user.username !== 'admin').map((user) => (
                    <div key={user.id} className={styles.usersPageCard}>
                      <div className={styles.usersPageCardHeader}>
                        <img
                          src={user.profile_pic || '/default-avatar.png'}
                          alt={user.username}
                          className={styles.usersPageAvatar}
                        />
                        <div className={styles.usersPageInfo}>
                          <h3 className={styles.usersPageName}>@{user.username}</h3>
                          <p className={styles.usersPageFullName}>{user.first_name} {user.last_name}</p>
                          <div className={styles.usersPageStatusWrapper}>
                            <span className={`${styles.usersPageStatus} ${
                              user.status === 'active' ? styles.usersPageStatusActive :
                              user.status === 'suspended' ? styles.usersPageStatusSuspended :
                              styles.usersPageStatusBanned
                            }`}>
                              {(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.usersPageStats}>
                        <div className={styles.usersPageStat}>
                          <p className={styles.usersPageStatValue}>
                            {analytics?.users.most_active.find(u => u.id === user.id)?.post_count || 0}
                          </p>
                          <p className={styles.usersPageStatLabel}>Posts</p>
                        </div>
                        <div className={styles.usersPageStat}>
                          <p className={styles.usersPageStatValue}>
                            {analytics?.users.most_active.find(u => u.id === user.id)?.like_count || 0}
                          </p>
                          <p className={styles.usersPageStatLabel}>Likes</p>
                        </div>
                        <div className={styles.usersPageStat}>
                          <p className={styles.usersPageStatValue}>
                            {analytics?.users.most_active.find(u => u.id === user.id)?.comment_count || 0}
                          </p>
                          <p className={styles.usersPageStatLabel}>Comments</p>
                        </div>
                      </div>
                      <div className={styles.usersPageActions}>
                        <button 
                          className={`${styles.usersPageActionButton} ${styles.usersPageViewButton}`}
                          onClick={() => handleUserClick(user)}
                        >
                          <i className="fas fa-eye"></i> View
                        </button>
                        <select
                          className={`${styles.usersPageActionButton} ${styles.usersPageStatusButton}`}
                          value={user.status}
                          onChange={(e) => handleStatusChange(user, e.target.value as User['status'])}
                        >
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                          <option value="banned">Banned</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.postsGrid}>
                  {filteredPosts.map((post: any) => (
                    <div key={post.id} className={styles.postCard}>
                      <div className={styles.postImageContainer}>
                        <img
                          src={post.design__image_url}
                          alt={post.caption}
                          className={`${styles.postImage2} ${post.design__type === 'customed rubber case' ? styles.rubberCase : ''}`}
                        />
                      </div>
                      <div className={styles.postContent}>
                        <p className={styles.postCaption}>{post.caption}</p>
                        <div className={styles.postUser2}>
                          <img
                            src={post.user__profile_pic}
                            alt={post.user__username}
                            className={styles.usersPageAvatar}
                          />
                                          <p onClick={async () => {
                  const token = localStorage.getItem('token');
                  if (token) {
                    try {
                      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${post.user__id}/`, {
                        headers: {
                          'Authorization': `Bearer ${token}`
                        }
                      });
                      if (response.ok) {
                        const userData = await response.json();
                        handleUserClick(userData);
                      }
                    } catch (error) {
                      console.error('Error fetching user data:', error);
                    }
                  }
                }} style={{cursor: 'pointer'}}>{post.user__username}</p>
                        </div>
                        <div className={styles.postMeta}>
                          <div className={styles.postStats}>
                            <span className={styles.postStat}>
                              <i className="fas fa-heart"></i> {post.like_count}
                            </span>
                            <span className={styles.postStat}>
                              <i className="fas fa-comment"></i> {post.comment_count || 0}
                            </span>
                            <span className={styles.postStat}>
                              <i className="fas fa-bookmark"></i> {post.favorite_count || 0}
                            </span>
                          </div>
                          <span className={styles.postDate}>
                            {formatDate(post.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className={styles.postActions}>
                        <button 
                          className={`${styles.postActionButton} ${styles.viewButton}`}
                          onClick={() => handlePostClick(post)}
                        >
                          <i className="fas fa-eye"></i> View
                        </button>
                        <button 
                          className={`${styles.postActionButton} ${styles.deleteButton}`}
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                              handleDeletePost(post.id);
                            }
                          }}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className={styles.reportsSection}>
              <div className={styles.sectionHeader}>
                <h2>Reports</h2>
                <div className={styles.filterControls}>
                  <select 
                    className={styles.filterSelect}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                  </select>
                  <select 
                    className={styles.filterSelect}
                    value={contentTypeFilter}
                    onChange={(e) => setContentTypeFilter(e.target.value)}
                  >
                    <option value="all">All Content</option>
                    <option value="post">Posts</option>
                    <option value="comment">Comments</option>
                  </select>

                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.reportsTable}>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Reported By</th>
                      <th>Reason</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr 
                        key={report.id} 
                        className={`${styles.reportRow} ${selectedReport?.id === report.id ? styles.expanded : ''} ${report.status === 'reviewed' ? styles.reviewed : ''}`}
                        onClick={() => handleReportClick(report)}
                      >
                        <td>#{report.id}</td>
                        <td>{report.content_type}</td>
                        <td>{report.reported_by}</td>
                        <td>{report.reason}</td>
                        <td>{formatDate(report.created_at)}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[report.status]}`}>
                            {report.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className={styles.announcementsSection}>
              <h2>Announcements</h2>
              <button className={styles.newAnnouncementButton}>Create New Announcement</button>
              <div className={styles.announcementsTable}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.tableHeader}>Title</th>
                      <th className={styles.tableHeader}>Priority</th>
                      <th className={styles.tableHeader}>Status</th>
                      <th className={styles.tableHeader}>Publish Date</th>
                      <th className={styles.tableHeader}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.map(announcement => (
                      <tr key={announcement.id} className={styles.tableRow}>
                        <td className={styles.tableCell}>{announcement.title}</td>
                        <td className={styles.tableCell}>{announcement.priority}</td>
                        <td className={styles.tableCell}>{announcement.status}</td>
                        <td className={styles.tableCell}>{formatDate(announcement.publish_date)}</td>
                        <td className={styles.tableCell}>
                          <button className={styles.button} onClick={() => handleAnnouncementPublish(announcement.id)}>
                            {announcement.status === 'draft' ? 'Publish' : 'Unpublish'}
                          </button>
                          <button className={styles.button}>Edit</button>
                          <button className={styles.button}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'phone-products' && (
            <div className={styles.phoneProductsSection}>
              <div className={styles.productFilters}>
                <div className={styles.filterControls}>
                  <div className={styles.searchBar}>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                    <i className="fas fa-search"></i>
                  </div>
                  <select
                    value={productTypeFilter}
                    onChange={(e) => setProductTypeFilter(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Types</option>
                    <option value="customed rubber case">Rubber Cases</option>
                    <option value="customed clear case">Clear Cases</option>
                  </select>
                  <select
                    value={productModelFilter}
                    onChange={(e) => setProductModelFilter(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Models</option>
                    {Array.from(new Set(phoneProducts.map(p => p.modell))).map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Stock Status</option>
                    <option value="in">In Stock</option>
                    <option value="out">Out of Stock</option>
                  </select>
                </div>
              </div>

              <FilteredProducts
                products={phoneProducts}
                searchTerm={productSearchTerm}
                typeFilter={productTypeFilter}
                modelFilter={productModelFilter}
                stockFilter={stockFilter}
                onStockChange={handleStockChange}
                onPriceChange={handlePriceChange}
              />
            </div>
          )}
        </main>
      </div>

      {/* Overlay for expanded chart */}
      <div 
        className={`${styles.overlay} ${expandedChart ? styles.active : ''}`}
        onClick={handleCloseChart}
      />

      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div className={`${styles.modalContent} ${styles.orderModalContent}`} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setSelectedOrder(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h2>Order Details</h2>
            {statusUpdateMessage && (
              <div className={styles.statusUpdateMessage}>
                {statusUpdateMessage}
              </div>
            )}
            <div className={styles.orderDetails}>
              <div className={styles.detailImage}>
                <img src={selectedOrder.image_url} alt="Order design" />
              </div>
              <div className={styles.detailInfo}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Order ID:</span>
                  <span className={styles.detailValue}>#{selectedOrder.id}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Order Date:</span>
                  <span className={styles.detailValue}>{formatDate(selectedOrder.created_at)}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Customer:</span>
                  <span className={styles.detailValue}>{selectedOrder.first_name} {selectedOrder.last_name}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Email:</span>
                  <span className={styles.detailValue}>{selectedOrder.email}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Phone:</span>
                  <span className={styles.detailValue}>{selectedOrder.phone_number}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Address:</span>
                  <span className={styles.detailValue}>{selectedOrder.address}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>City:</span>
                  <span className={styles.detailValue}>{selectedOrder.city}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Country:</span>
                  <span className={styles.detailValue}>{selectedOrder.country}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Model:</span>
                  <span className={styles.detailValue}>{selectedOrder.modell}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Type:</span>
                  <span className={styles.detailValue}>{selectedOrder.type}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Quantity:</span>
                  <span className={styles.detailValue}>{selectedOrder.quantity}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Product Price:</span>
                  <span className={styles.detailValue}>${selectedOrder.price}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Total Price:</span>
                  <span className={styles.detailValue}>${selectedOrder.price * selectedOrder.quantity}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Status:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleOrderStatusUpdate(selectedOrder.id, e.target.value as Order['status'])}
                    className={styles.statusSelect}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPost && (
        <div className={`${styles.modalOverlay} ${styles.neededIndex}`} onClick={() => setSelectedPost(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setSelectedPost(null)}>×</button>
            <div className={`${styles.selectedPostContent} ${selectedPost.design__type === 'customed rubber case' ? styles.wideImagePostContent : ''}`}>
              <div className={styles.postImage}>
                <img src={selectedPost.design__image_url} alt={selectedPost.caption} />
              </div>
              <div className={styles.postDetails}>
                <div className={styles.postStats}>
                  <div className={styles.stat}>
                    <span>Likes</span>
                    <span>{selectedPost.like_count}</span>
                  </div>
                  <div className={styles.stat}>
                    <span>Comments</span>
                    <span>{selectedPost.comment_count}</span>
                  </div>
                  <div className={styles.stat}>
                    <span>Favorites</span>
                    <span>{selectedPost.favorite_count}</span>
                  </div>
                </div>
                <div className={styles.postInfo}>
                  <div className={styles.postHeader}>
                    <h3>{selectedPost.caption}</h3>
                    <button 
                      onClick={() => {if(window.confirm('Are you sure you want to delete this post? This action cannot be undone.')){handleDeletePost(selectedPost.id)}}}
                      className={`${styles.deleteButton} ${styles.deletePostButton}`}
                      title="Delete post"
                    >
                      Delete Post
                    </button>
                  </div>
                  <div className={styles.postMeta}>
                    <p className={styles.posterName}>
                      <i className="fas fa-user"></i>
                      <span onClick={async () => {
                        const token = localStorage.getItem('token');
                        if (token) {
                          try {
                            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${selectedPost.user__id}/`, {
                              headers: {
                                'Authorization': `Bearer ${token}`
                              }
                            });
                            if (response.ok) {
                              const userData = await response.json();
                              handleUserClick(userData);
                            }
                          } catch (error) {
                            console.error('Error fetching user data:', error);
                          }
                        }
                      }} style={{cursor: 'pointer'}}>@{selectedPost.user__username}</span>
                    </p>
                    <p className={styles.postDate}>
                      <i className="fas fa-clock"></i>
                      {new Date(selectedPost.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className={styles.postDescription}>{selectedPost.description}</p>
                  <div className={styles.designInfo}>
                    <p><strong>Model:</strong> {selectedPost.design__modell}</p>
                    <p><strong>Type:</strong> {selectedPost.design__type}</p>
                  </div>
                </div>
                <div className={styles.commentsSection}>
                  <div className={styles.commentsHeader}>
                    <h4>Comments ({comments.length})</h4>
                    <div className={styles.commentActions}>
                      <button
                        className={styles.showAllButton}
                        onClick={() => setShowCommentsModal(true)}
                        title="View all comments"
                      >
                        <i className="fas fa-external-link-alt"></i>
                        Show All
                      </button>
                      <button 
                        className={styles.refreshButton}
                        onClick={() => handlePostClick(selectedPost)}
                        title="Refresh comments"
                      >
                        <i className="fas fa-sync-alt"></i>
                      </button>
                    </div>
                  </div>
                  
                  {commentError && (
                    <div className={styles.errorMessage}>
                      <i className="fas fa-exclamation-circle"></i>
                      {commentError}
                    </div>
                  )}

                  {commentLoading ? (
                    <div className={styles.loadingComments}>
                      <i className="fas fa-spinner fa-spin"></i>
                      Loading comments...
                    </div>
                  ) : (
                    <div className={`${styles.commentsList} `}>
                      {comments.length > 0 ? (
                        comments.map((comment: Comment) => (
                          <div key={comment.id} className={styles.commentItem}>
                            <div className={styles.commentHeader}>
                              <div className={styles.commentUser}>
                                <img 
                                  src={comment.profile_pic || '/default-avatar.png'} 
                                  alt={comment.first_name} 
                                  className={styles.commentAvatar} 
                                />
                                <div className={styles.commentInfo}>
                                  <span className={styles.commentUsername}>{comment.first_name}</span>
                                  <span className={styles.commentDate}>
                                    {new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString()}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteCommentOptimistic(comment.id)}
                                className={styles.deleteButton}
                                title="Delete comment"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                            <p className={styles.commentContent}>{comment.content}</p>
                          </div>
                        ))
                      ) : (
                        <div className={styles.noComments}>
                          <i className="fas fa-comments"></i>
                          <p>No comments yet</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedPost2 && (
        <div className={styles.modalOverlay} onClick={() => setSelectedPost(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setSelectedPost2(null)}>×</button>
            <div className={`${styles.selectedPostContent} ${selectedPost2.design.type === 'customed rubber case' ? styles.wideImagePostContent : ''}`}>
              <div className={styles.postImage}>
                <img src={selectedPost2.design.image_url} alt={selectedPost2.caption} />
              </div>
              <div className={styles.postDetails}>
                <div className={styles.postStats}>
                  <div className={styles.stat}>
                    <span>Likes</span>
                    <span>{selectedPost2.like_count}</span>
                  </div>
                  <div className={styles.stat}>
                    <span>Comments</span>
                    <span>{selectedPost2.comment_count}</span>
                  </div>
                  <div className={styles.stat}>
                    <span>Favorites</span>
                    <span>{selectedPost2.favorite_count}</span>
                  </div>
                </div>
                <div className={styles.postInfo}>
                  <div className={styles.postHeader}>
                    <h3>{selectedPost2.caption}</h3>
                    <button
                                                onClick={() => {
                                                  if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                                                    handleDeletePost(selectedPost2.id);
                                                  }
                                                }}
                      className={`${styles.deleteButton} ${styles.deletePostButton}`}
                      title="Delete post"
                    >
                      Delete Post
                    </button>
                  </div>
                  <div className={styles.postMeta}>
                    <p className={styles.posterName}>
                      <i className="fas fa-user"></i>
                      <span>@{selectedPost2.user}</span>
                    </p>
                    <p className={styles.postDate}>
                      <i className="fas fa-clock"></i>
                      {new Date(selectedPost2.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className={styles.postDescription}>{selectedPost2.description}</p>
                  <div className={styles.designInfo}>
                    <p><strong>Model:</strong> {selectedPost2.design.modell}</p>
                    <p><strong>Type:</strong> {selectedPost2.design.type}</p>
                  </div>
                </div>
                <div className={styles.commentsSection}>
                  <div className={styles.commentsHeader}>
                    <h4>Comments ({comments.length})</h4>
                    <div className={styles.commentActions}>
                      <button
                        className={styles.showAllButton}
                        onClick={() => setShowCommentsModal(true)}
                        title="View all comments"
                      >
                        <i className="fas fa-external-link-alt"></i>
                        Show All
                      </button>

                    </div>
                  </div>
                  
                  {commentError && (
                    <div className={styles.errorMessage}>
                      <i className="fas fa-exclamation-circle"></i>
                      {commentError}
                    </div>
                  )}

                  {commentLoading ? (
                    <div className={styles.loadingComments}>
                      <i className="fas fa-spinner fa-spin"></i>
                      Loading comments...
                    </div>
                  ) : (
                    <div className={`${styles.commentsList} `}>
                      {comments.length > 0 ? (
                        comments.map((comment: Comment) => (
                          <div key={comment.id} className={styles.commentItem}>
                            <div className={styles.commentHeader}>
                              <div className={styles.commentUser}>
                                <img 
                                  src={comment.profile_pic || '/default-avatar.png'} 
                                  alt={comment.first_name} 
                                  className={styles.commentAvatar} 
                                />
                                <div className={styles.commentInfo}>
                                  <span className={styles.commentUsername}>{comment.first_name}</span>
                                  <span className={styles.commentDate}>
                                    {new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString()}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteCommentOptimistic(comment.id)}
                                className={styles.deleteButton}
                                title="Delete comment"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                            <p className={styles.commentContent}>{comment.content}</p>
                          </div>
                        ))
                      ) : (
                        <div className={styles.noComments}>
                          <i className="fas fa-comments"></i>
                          <p>No comments yet</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Comments Modal */}
      {showCommentsModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCommentsModal(false)}>
          <div className={`${styles.modalContent} ${styles.commentsModalContent}`} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setShowCommentsModal(false)}>×</button>
            <h2>Comments</h2>
            {commentError && (
              <div className={styles.errorMessage}>
                <i className="fas fa-exclamation-circle"></i>
                {commentError}
              </div>
            )}

            {commentLoading ? (
              <div className={styles.loadingComments}>
                <i className="fas fa-spinner fa-spin"></i>
                Loading comments...
              </div>
            ) : ( 
              <div className={`${styles.commentsList} ${styles.fullCommentsList}`}>
                {comments.length > 0 ? (
                  comments.map((comment: Comment) => (
                    <div key={comment.id} className={styles.commentItem}>
                      <div className={styles.commentHeader}>
                        <div className={styles.commentUser}>
                          <img 
                            src={comment.profile_pic || '/default-avatar.png'} 
                            alt={comment.first_name} 
                            className={styles.commentAvatar} 
                          />
                          <div className={styles.commentInfo}>
                            <span className={styles.commentUsername}>{comment.first_name}</span>
                            <span className={styles.commentDate}>
                              {new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteCommentOptimistic(comment.id)}
                          className={styles.deleteButton}
                          title="Delete comment"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <p className={styles.commentContent}>{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <div className={styles.noComments}>
                    <i className="fas fa-comments"></i>
                    <p>No comments yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <div className={styles.reportModalOverlay} >
          <div className={styles.reportModalPaper}>
            <div className={styles.reportModalHeader}>
              <h3>Report Details</h3>
              <button className={styles.reportCloseButton} onClick={() => setSelectedReport(null)}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <div className={styles.reportModalContent}>
                      <div className={styles.reportInfoSection}>
                        <h4>Report Information</h4>
                        <p><strong>Type:</strong> {selectedReport.content_type}</p>
                        <p><strong>Reported By:</strong> {selectedReport.reported_by}</p>
                        <p><strong>Reason:</strong> {selectedReport.reason}</p>
                        <p><strong>Date:</strong> {formatDate(selectedReport.created_at)}</p>
                        <p><strong>Status:</strong> {selectedReport.status}</p>
                      </div>
                      <div className={styles.reportContentSection}>
                          
                        {selectedReport.content_details ? (

                        
                          selectedReport.content_type === 'post' ? (
                            <div>
                              {!selectedReport.content_details?.caption ? (
                                <div className={styles.deletedContent}>
                                  <i className="fas fa-trash"></i>
                                  <span>This post has been deleted</span>
                                  <span>The content is no longer available</span>
                                </div>
                              ) : (
                                <div className={styles.reportPostContent}>
                                  <div className={styles.reportPostImage}>
                                    {selectedReport.content_details.image_url && (
                                      <img
                                        src={selectedReport.content_details.image_url}
                                        alt="Reported post"
                                        className={selectedReport.content_details?.design__type === 'customed rubber case' ? styles.reportWideImage : ''}
                                      />
                                    )}
                                  </div>
                                  <div className={styles.reportPostDetails}>
                                    <div className={styles.reportPostHeader}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                        <h2>{selectedReport.content_details.caption}</h2>
                                        <button
                                          onClick={() => {
                                            console.log('Delete button clicked');
                                            console.log('Full report details:', selectedReport?.content_details);
                                            if (selectedReport?.content_details?.post_id) {
                                              console.log('Post ID:', selectedReport.content_details.post_id);
                                              handleDeleteReportPost(selectedReport.content_details.post_id);
                                            } else {
                                              console.log('No post ID found in report details');
                                            }
                                          }}
                                          className={`${styles.deleteButton} ${styles.deletePostButton}`}
                                          title="Delete post"
                                          style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                                        >
                                          Delete Post
                                        </button>
                                      </div>
                                    </div>
                                    <div className={styles.reportPostMeta}>
                                      <span className={styles.reportPosterName}  onClick={async () => {
                                                          const token = localStorage.getItem('token');
                                                          if (token) {
                                                            try {
                                                              const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${selectedReport.content_details?.user_id}/`, {
                                                                headers: {
                                                                  'Authorization': `Bearer ${token}`
                                                                }
                                                              });
                                                              if (response.ok) {
                                                                const userData = await response.json();
                                                                handleUserClick(userData);
                                                              }
                                                            } catch (error) {
                                                              console.error('Error fetching user data:', error);
                                                            }
                                                          }
                                                        }} style={{cursor: 'pointer'}}>
                                        <i className="fas fa-user"></i>
                                        <span >{selectedReport.content_details.user}</span>
                                      </span>
                                      <span className={styles.reportPostDate}>
                                        <i className="fas fa-clock"></i>
                                        {formatDate(selectedReport.content_details.created_at)}
                                      </span>
                                    </div>
                                    <div className={styles.reportPostDescription}>
                                      {selectedReport.content_details.description}
                                    </div>
                                    <div className={styles.reportCommentsSection}>
                                      <div className={styles.reportCommentsHeader}>
                                        <h4>Comments</h4>
                                        {selectedReport?.content_details && (
                                          <div className={styles.commentActions}>
                                            <button
                                              onClick={async () => {
                                                const details = selectedReport.content_details;
                                                if (!details) return;
                                                
                                                try {
                                                  // Fetch comments directly
                                                  const commentsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${details.post_id}/comments/`);
                                                  if (!commentsResponse.ok) {
                                                    throw new Error('Failed to fetch comments');
                                                  }
                                                  const data = await commentsResponse.json();
                                                  setComments(data.comments || []);
                                                  setShowCommentsModal(true);
                                                } catch (error) {
                                                  console.error('Error fetching comments:', error);
                                                  setCommentError('Failed to load comments. Please try again.');
                                                }
                                              }}
                                              className={styles.showAllButton}
                                            >
                                              Show All
                                              <i className="fas fa-external-link-alt"></i>
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                      {selectedReport?.content_details?.comments && selectedReport.content_details.comments.length > 0 ? (
                                          <div className={styles.reportCommentsList}>
                                            {selectedReport.content_details.comments.map((comment: any) => (
                                              <div key={comment.id} className={styles.reportCommentItem}>
                                                <div className={styles.reportCommentHeader}>
                                                  <div className={styles.reportCommentUser}>
                                                    <img
                                                      src={comment.profile_pic}
                                                      alt={comment.username}
                                                      className={styles.reportCommentAvatar}
                                                      onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/default-avatar.png';
                                                      }}
                                                    /> 
                                                    
                                                    <div className={styles.reportCommentInfo}>
                                                      <span 
                                                        className={styles.reportCommentUsername}
                                                        onClick={async () => {
                                                          const token = localStorage.getItem('token');
                                                          if (token) {
                                                            try {
                                                              const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${comment.user_id}/`, {
                                                                headers: {
                                                                  'Authorization': `Bearer ${token}`
                                                                }
                                                              });
                                                              if (response.ok) {
                                                                const userData = await response.json();
                                                                handleUserClick(userData);
                                                              }
                                                            } catch (error) {
                                                              console.error('Error fetching user data:', error);
                                                            }
                                                          }
                                                        }}
                                                        style={{ cursor: 'pointer' }}
                                                      >
                                                        {comment.user}
                                                      </span>
                                                      <span className={styles.reportCommentDate}>
                                                        {formatDate(comment.created_at)}
                                                      </span>
                                                    </div>
                                                  </div>
                                                  <div className={styles.reportCommentActions}>
                                                    <button
                                                      onClick={() => handleDeleteReportCommentOptimistic(comment.id)}
                                                      className={styles.deleteButton}
                                                      title="Delete comment"
                                                    >
                                                      <i className="fas fa-trash"></i>
                                                    </button>
                                                  </div>
                                                </div>
                                                <div className={styles.reportCommentContent}>
                                                  {comment.content === '[Deleted]' ? (
                                                    <div className={styles.deletedContent}>
                                                      <i className="fas fa-trash"></i>
                                                      <span>This comment has been deleted</span>
                                                    </div>
                                                  ) : (
                                                    <p>{comment.content}</p>
                                                  )}
                                                </div>
                                                {selectedReport.content_details?.post_caption && (
                                                  <div 
                                                    className={styles.reportPostDescription}
                                                    onClick={() => handlePostClick({
                                                      id: selectedReport.content_details?.post_id,
                                                      caption: selectedReport.content_details?.post_caption,
                                                      description: selectedReport.content_details?.post_description,
                                                      created_at: selectedReport.content_details?.post_created_at,
                                                      design__image_url: selectedReport.content_details?.post_image_url,
                                                      user: selectedReport.content_details?.post_user,
                                                      design__modell: selectedReport.content_details?.design__modell,
                                                      design__type: selectedReport.content_details?.design__type,
                                                      design__price: selectedReport.content_details?.design__price,
                                                      like_count: 0,
                                                      comment_count: 0,
                                                      favorite_count: 0,
                                                      user__username: selectedReport.content_details?.post_user
                                                    })}
                                                    style={{ cursor: 'pointer' }}
                                                  >
                                                    <strong>On post:</strong> {selectedReport.content_details.post_caption}
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className={styles.noComments}>
                                            <i className="fas fa-comments"></i>
                                            <span>No comments yet</span>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                        
                            <div className={styles.reportCommentItem}>

                              <div className={styles.reportCommentContent}>
                                {!selectedReport.content_details?.content ? (
                                  <div className={styles.deletedContent}>
                                    <i className="fas fa-trash"></i>
                                    <span>This comment has been deleted</span>
                                  </div>
                                ) : (
                                  <div className={styles.reportCommentHeader}>
                                  <div className={styles.reportCommentUser}>
                                    <img
                                      src={selectedReport.content_details?.profile_pic}
                                      alt={selectedReport.content_details?.user}
                                      className={styles.reportCommentAvatar}
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/default-avatar.png';
                                      }}
                                    />
                                    <div className={styles.reportCommentInfo}>
                                      <span  onClick={async () => {
                                              const token = localStorage.getItem('token');
                                               if (token) {
                                                try {
                                                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${selectedReport.content_details?.user_id}/`, {
                                                     headers: {
                                                                  'Authorization': `Bearer ${token}`
                                                                }
                                                          });
                                                           if (response.ok) {
                                                                const userData = await response.json();
                                                                handleUserClick(userData);
                                                              }
                                                            } catch (error) {
                                                              console.error('Error fetching user data:', error);
                                                            }
                                                          }
                                      }} className={styles.reportCommentUsername}>{selectedReport.content_details?.user}</span>
                                      {selectedReport.content_details?.created_at && (
                                        <span className={styles.reportCommentDate}>
                                          {formatDate(selectedReport.content_details.created_at)}
                                        </span> 
                                      )}

                                      


                                    </div>
                                    
                                  </div>

                                          <div className={styles.reportCommentActions}>
                                              <button
                                        onClick={() => handleDeleteComment(selectedReport.content_id)}
                                        className={styles.deleteButton}
                                        title="Delete comment"
                                      >
                                        <i className="fas fa-trash"></i>
                                      </button>
                                    </div>
                                    
                        </div>
                        
                        )}
                        
                      </div>
                      <div className={styles.reportCommentContent2}>
                                    {selectedReport.content_details.content}
                              </div>
                      {selectedReport.content_details.post_caption && (
                        <div 
                          className={styles.reportPostDescription}
                          onClick={() => handlePostClick({
                            id: selectedReport.content_details?.post_id,
                            caption: selectedReport.content_details?.post_caption,
                            description: selectedReport.content_details?.post_description,
                            created_at: selectedReport.content_details?.post_created_at,
                            design__image_url: selectedReport.content_details?.post_image_url,
                            user: selectedReport.content_details?.post_user,
                            design__modell: selectedReport.content_details?.design__modell,
                            design__type: selectedReport.content_details?.design__type,
                            design__price: selectedReport.content_details?.design__price,
                            like_count: 0,
                            comment_count: 0,
                            favorite_count: 0,
                            user__username: selectedReport.content_details?.post_user
                          })}
                          style={{ cursor: 'pointer' }}
                        >
                          <strong>ON POST:</strong> {selectedReport.content_details.post_caption}
                        </div>
                      )}
                    </div>




                  )
                ) : (
                  <div className={styles.reportNoComments}>
                    <i className="fas fa-exclamation-circle"></i>
                    <p>Content not available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Details Modal */}





      

      {isUserModalOpen && selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          posts={userPosts} 
          onClose={() => setIsUserModalOpen(false)} 
        />
      )}
      <StatusConfirmationModal />
      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Confirm Delete</h3>
              <button className={styles.closeButton} onClick={cancelDelete}>×</button>
            </div>
            <div className={styles.modalBody}>
              <p>Are you sure you want to delete this post? This action cannot be undone.</p>
              <div className={styles.modalActions}>
                <button 
                  className={`${styles.button} ${styles.cancelButton}`}
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button 
                  className={`${styles.button} ${styles.deleteButton}`}
                  onClick={() => deleteConfirmation.postId && handleDeletePost(deleteConfirmation.postId)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

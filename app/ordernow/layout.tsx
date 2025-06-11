"use client";

import React, { useState,useEffect } from 'react';
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from '../fyp/fyp.module.css';
import styles0 from '../orderlist/orderlist.module.css';

import styles1 from '../profile/profile.module.css';
import styles3 from '../explore/explore.module.css';


import { ceil } from 'three/webgpu';

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




interface LayoutProps {
    children: React.ReactNode;
  }
  
  export default function Layout({ children }: LayoutProps) {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);

  const [orders, setOrders] = useState<any[]>([]);  // Store the orders data

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null); // Store the selected order
  const router = useRouter();
  const [query, setQuery] = useState(''); // Search query state
  const [posts, setPosts] = useState([]); // State for post results
  const [users, setUsers] = useState([]); // State for user results
  const [isSearching, setIsSearching] = useState(false); // State for user results
  const pathname = usePathname();
  const [error, setError] = useState(null); // Error state
 const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // true if token exists
  }, []);

      useEffect(() => {
        const fetchNotifications = async () => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            });
    
            if (response.ok) {
              const data = await response.json();
              setNotifications(data.notifications); // Assuming the backend returns notifications with correct `read` statuses
            } else {
              console.error('Failed to fetch notifications');
            }
          } catch (error) {
            console.error('Error fetching notifications:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchNotifications();
      }, []);


            useEffect(() => {
              const token = localStorage.getItem("token"); // Retrieve the token from localStorage
          
              console.log("Token in localStorage:", token); // Log to see if token exists in localStorage
          
              if (token) {
                try {
                  const decodedToken = decodeJwt(token); // Decode the JWT manually
                  console.log("Decoded Token:", decodedToken); // Log the decoded token structure
          
                  // Set the loggedInUsername to the `user_id` from the token
                  setLoggedInUsername(decodedToken.user_id); // You can use .toString() to make sure it's a string
                } catch (error) {
                  console.error("Error decoding token", error); // Log any decoding errors
                }
              } else {
                console.log("No token found in localStorage"); // Log if no token is found
              }
            }, []); // Runs once when the component mounts




            useEffect(() => {
              const fetchOrders = async () => {
                const token = localStorage.getItem("token");
          

                try {
                  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getOrder/`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  });
          
                  if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                  }
          
                  const data = await response.json();
                  setOrders(data);  // Store the orders data
                  console.log(data);
                } catch (error) {
                  setError("An error occurred while fetching orders.");
                } finally {
                  setLoading(false);
                }
              };
          
              fetchOrders();
            }, [router]);
          
            // Display loading or error message
            if (loading) {
              return <div>Loading...</div>;
            }
          

          

          
            // Handle click on order row to view details
            const handleOrderClick = (order: any) => {
              setSelectedOrder(order); // Set the selected order to show its details
            };
          
            function cancilselect(){
              setSelectedOrder(null)
            }

            

    
      // Mark notification as read
      const markAsRead = async (notificationId) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/${notificationId}/read/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
      
          if (response.ok) {
            // Update the notifications state after successfully marking as read
            setNotifications((prevNotifications) =>
              prevNotifications.map((notification) =>
                notification.id === notificationId
                  ? { ...notification, is_read: true }
                  : notification
              )
            );
          } else {
            alert('Failed to mark notification as read');
          }
        } catch (error) {
          console.error('Error marking notification as read:', error);
        }
      };
      
    
      // Delete notification
      const deleteNotification = async (notificationId) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/${notificationId}/delete/`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
    
          if (response.ok) {
            setNotifications((prevState) =>
              prevState.filter((notification) => notification.id !== notificationId)
            );
          } else {
            console.error('Failed to delete notification');
          }
        } catch (error) {
          console.error('Error deleting notification:', error);
        }
      };
    

      const toggleSection = (section) => {
        if (activeSection === section) {
          // If the same section is clicked again, deactivate it
          setActiveSection(null);
        } else {
          if (section === 'section2') {
            // Mark all unread notifications as read when opening section2
            notifications.forEach((notification) => {
              if (!notification.is_read) {
                markAsRead(notification.id);
              }
            });
          }
          // Set the clicked section as active
          setActiveSection(section);
        }
      };
    const isSectionActive = activeSection !== null;







  
    const handleSearch = async () => {
      if (!query) return; // Don't search if no query is entered
      setLoading(true);
      setError(null);
      setIsSearching(true); // Set searching state
    
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/search_posts/?query=${query}`); // Update to match the backend endpoint
        const data = await response.json();
    
        if (response.ok) {
          // Update states for posts and users
          setPosts(data.posts || []);
          setUsers(data.users || []);
          console.log('Search Results:', data); // Log data for debugging
        } else {
          console.error('Error fetching search results:', data);
          setError(data.error || 'An unknown error occurred.');
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to fetch search results.');
      } finally {
        setLoading(false);
      }
    };
    
    const clearSearch = () => {
      setQuery('');
      setPosts([]);
      setUsers([]);
      setIsSearching(false);
    };
    function handleKeyDown(e) {
      if (e.key === 'Enter') {
        handleSearch(); // Trigger the search when Enter key is pressed
      }
    };

    const logout = () => {
      const confirmed = window.confirm('Are you sure you want to log out?');
    
      if (confirmed) {
        localStorage.removeItem('token'); // or remove both access + refresh tokens
        alert('You have been logged out.');
        window.location.href = '/login'; // or router.push('/login')
      }
    };

    if(selectedOrder){
      return(
          <div className={styles0.orderDetails}>
            <div className={styles0.card}>
              <div className={styles0.cardImage}>
                <img src={selectedOrder.image_url} alt="Order design" />
              </div>
              <div className={styles0.cardContent}>
                <h2 className={styles0.cardTitle}>{selectedOrder.type}</h2>
                <h3 className={styles0.cardSubtitle}>{selectedOrder.modell}</h3>
                <div className={styles0.cardInfo}>
                  <p><strong>First Name:</strong> {selectedOrder.first_name}</p>
                  <p><strong>Last Name:</strong> {selectedOrder.last_name}</p>
                  <p><strong>Email:</strong> {selectedOrder.email}</p>
                  <p><strong>Phone Number:</strong> {selectedOrder.phone_number}</p>
                  <p><strong>Country:</strong> {selectedOrder.country}</p>
                  <p><strong>City:</strong> {selectedOrder.city}</p>
                  <p><strong>Address:</strong> {selectedOrder.address}</p>
                  <p><strong>Price:</strong> ${selectedOrder.price}</p>
                  <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                  <p><strong>TotalPrice:</strong> ${selectedOrder.price * selectedOrder.quantity}</p>

                </div>
                <div className={styles0.cardFooter}>
                  <button onClick={cancilselect} className={styles0.backButton}>
                    Back to Orders
                  </button>
  
                </div>  
              </div>
            </div>
          </div>
      )
  }
 
  const isActive = (path) => pathname === path;
  const isActive2 = (section) => activeSection === section;
  console.log('Router object:', pathname);


    return (
   
   <div style={{ height: '100vh',backgroundColor : 'rgb(255, 255, 255)',position : "relative",fontFamily :'"Roboto", serif',display:'flex',flexDirection :"column" }}>

<header className={`${styles.header}`} style={{ marginBottom: '0px' }}>
  <div className={styles.headerfirstdiv}>
    <img src="../stickers/[removal.ai]_93d42e55-04b2-4fae-85a0-86a71d5bf1b2-photo_2025-01-01_15-30-26.png" alt="" />
    <div
      style={{ position: 'relative', marginLeft: '50px' }}
      className={styles.searchContainer}
    >
   <input
  type="text"
  placeholder="Search"
  value={query}
  onChange={(e) => {
    setQuery(e.target.value);
    if (e.target.value.trim() === '') {
      setIsSearching(false); // Reset to children view when input is empty
    }
  }}
  onKeyDown={(e) => {
    if (e.key === 'Enter') handleKeyDown(e);
  }}
  onClick={(e) => {
    setActiveSection(null);
    handleKeyDown(e);
  }}
  onBlur={() => {
    if (query.trim() === '') {
      setIsSearching(false); // Reset to children view when input loses focus and is empty
    }
  }}
  className={`${styles.search}`}
/>
      <button onClick={handleSearch} className={styles.searchButton}>
        <i className="fas fa-search"></i>
      </button>
    </div>

{/* 
    <div className={styles.headerbuttonscontainer}  >
    <button className={styles.navButton}>
      <i className="fas fa-shopping-cart"></i>
    </button>
    <button className={styles.navButton}>
      <i className="fas fa-user"></i>
    </button>
      <Link href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
        <button className={styles.btn5}>Log In</button>
      </Link>
      <Link href="/register" style={{ color: 'inherit', textDecoration: 'none' }}>
        <button className={styles.Mainbtn5}>Sign In</button>
      </Link>
    </div>

*/}
    <div className={`${styles.hamburgerH}`}>
    <button className={styles.navButton}>
      <i className="fas fa-shopping-cart"></i>
    </button>
    <button className={styles.navButton}>
      <i className="fas fa-user"></i>
    </button>
    <div className={styles.headerbuttonscontainer}>
      {!isLoggedIn ? (
        <>
          <Link className={styles.bLink} href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
            <button className={styles.btn5}>Log In</button>
          </Link>
          <Link className={styles.bLink} href="/register" style={{ color: 'inherit', textDecoration: 'none' }}>
            <button className={styles.Mainbtn5}>Sign In</button>
          </Link>
        </>
      ) : (
        <div className={styles.bLink} style={{ color: 'inherit', textDecoration: 'none' }}>
          <div className={`${styles.navButton} ${styles.logout}`} onClick={logout}><i className="fas fa-right-from-bracket"></i></div>
        </div>
      )}
    </div>
    <button
      className={` ${styles.Mainbtn5} ${styles.hamburger}`}
      onClick={() => setMenuOpen(!menuOpen)}
    >
      <i className="fas fa-bars"></i>
    </button>

    </div>
  </div>

  <nav className={styles.nav}>
    {/* Navigation Buttons */}
    <button className={`${styles.navButton} ${isActive('/fyp') ? styles.activve : ''}`}>
      <Link style={{ color: 'inherit', textDecoration: 'none' }} href="/fyp">
        Home
      </Link>
    </button>
    <button className={`${styles.navButton} ${isActive('/about') ? styles.activve : ''}`}>
      <Link style={{ color: 'inherit', textDecoration: 'none' }} href="/about">
        About
      </Link>
    </button>
    <button className={`${styles.navButton} ${isActive('/blog') ? styles.activve : ''}`}>
      <Link style={{ color: 'inherit', textDecoration: 'none' }} href="/blog">
        Blog
      </Link>
    </button>
    <button className={`${styles.navButton} ${isActive('/pricing') ? styles.activve : ''}`}>
      <Link style={{ color: 'inherit', textDecoration: 'none' }} href="/pricing">
        Pricing
      </Link>
    </button>

    
    <button className={`${styles.navButton} ${isActive('/explore') ? styles.activve : ''}`}>
    <Link className={styles.bLink} href="/explore" style={{ color: 'inherit', textDecoration: 'none' }}>

      Explore
      </Link>

      

      </button>


          <button className={`${styles.navButton} ${isActive('/contactus') ? styles.activve : ''}`}>
      <Link
        style={{ color: 'inherit', textDecoration: 'none' }}
        href="/contactus"
      >
        Contact Us
      </Link>
    </button>


    <button className={`${styles.navButton} ${isActive('/BuyingChart') ? styles.activve : ''}`}>
    <Link className={styles.bLink} href="/BuyingChart" style={{ color: 'inherit', textDecoration: 'none' }}>
      <i className="fas fa-shopping-cart"></i>
      </Link>
    </button>


    <button className={`${styles.navButton} ${isActive('/profile') ? styles.activve : ''}`}>
    <Link className={styles.bLink} href="/profile" style={{ color: 'inherit', textDecoration: 'none' }}>

      <i className="fas fa-user"></i>
      </Link>
    </button>
      
    <div className={styles.headerbuttonscontainer} style={{ display: 'flex', gap: '10px' }}>
      {!isLoggedIn ? (
        <>
          <Link href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
            <button className={styles.btn5}>Log In</button>
          </Link>
          <Link href="/register" style={{ color: 'inherit', textDecoration: 'none' }}>
            <button className={styles.Mainbtn5}>Sign Up</button>
          </Link>
        </>
      ) : (
        <div className={`${styles.navButton} ${styles.logout}`} onClick={logout}><i className="fas fa-right-from-bracket"></i></div>
      )}
    </div>                   {/*=================================================================================================================================*/}
  </nav>

  {/* Dropdown menu */}
  <div className={`${styles.dropdownMenu} ${menuOpen ? styles.show : ''}`}>
    <button className={styles.navButton}>
      <Link style={{textDecoration : 'none',color : 'inherit'}} href="/fyp">Home</Link>
    </button>
    <button className={styles.navButton}>
      <Link style={{textDecoration : 'none',color : 'inherit'}} href="/about">About</Link>
    </button>
    <button className={styles.navButton}>
      <Link style={{textDecoration : 'none',color : 'inherit'}} href="/blog">Blog</Link>
    </button>
    <button className={styles.navButton}>
      <Link style={{textDecoration : 'none',color : 'inherit'}} href="/pricing">Pricing</Link>
    </button>
    <button className={styles.navButton}>
      <Link style={{textDecoration : 'none',color : 'inherit'}} href="/contactUs">Contact Us</Link>
    </button>
    <button  className={styles.navButton}>
      <Link style={{textDecoration : 'none',color : 'inherit'}} href="/contactUs">Explore</Link>
      </button>


    {/* Search bar for dropdown */}



  </div>
</header>

 <div className={`${styles.header2}`}>

 <div
      style={{ position: 'relative' }}
      className={styles.searchContainer}
    >

      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown} // Detect Enter key press
        onClick={() => {
          setActiveSection(null);
        }}
        className={`${styles.search1}`}
      />
      <button onClick={handleSearch} className={styles.searchButton1}>
        <i className="fas fa-search"></i>
      </button>
      <div>
        
      </div>
    </div>



<div className={`${styles.secbar}`}>

    <button className={`${styles.navButton} ${isActive2('section4') ? styles.activeButton : ''}`} onClick={() => toggleSection('section4')}>
    <i className="fas fa-palette"></i>
    
    <span className={styles.sidespans}>Create</span>
  </button>


  <button className={`${styles.navButton} ${isActive2('section2') ? styles.activeButton : ''}`} onClick={() => toggleSection('section2')}>
    <i className={`fas fa-bell`}></i>
    <span className={styles.sidespans}>Notification</span>
  </button>


  <button className={`${styles.navButton} ${isActive2('section1') ? styles.activeButton : ''}`} onClick={() => toggleSection('section1')}>
        <i className="fas fa-clipboard"></i>
    <span style={{textDecoration : "underline"}} className={styles.sidespans}>Orders</span>
  </button>
  <button className={styles.navButton}>

    <i className={`fas fa-star`}></i>
    <span className={styles.sidespans}>Favourite</span>

  </button>

  <Link style={{ color: 'inherit', textDecoration: 'none' }} href="/liked">
  <button className={styles.navButton}>
    <i className="fas fa-heart"></i>
    <span className={styles.sidespans}>Liked</span>
  </button>
  </Link>


    <button className={`${styles.navButton} ${isActive2('section3') ? styles.activeButton : ''}`} onClick={() => toggleSection('section3')}>
    <i className={`fas fa-gift`}></i>
    <span className={styles.sidespans}>Gift</span>
  </button>

  

  
  

  </div>
 </div>
      
      {/* Left Sidebar */}
      <div className={styles.sidebar}>
                {/*
          <button onClick={() => toggleSection('section1')} className={`${styles.sidebarButton} ${styles.btn5}`}>
            Section 1
          </button>
          <button onClick={() => toggleSection('section2')} className={`${styles.sidebarButton} ${styles.btn5}`}>
            Section 2
          </button>
          <button onClick={() => toggleSection('section3')} className={`${styles.sidebarButton} ${styles.btn5}`}>
            Section 3
          </button>
          */}
     
        <div className={`${styles.sidebarButtons}`}>

  <button className={`${styles.navButton} ${isActive2('section4') ? styles.activeButton : ''}`} onClick={() => toggleSection('section4')}>

    <i className="fas fa-palette"></i>
    <span className={styles.sidespans}>Create</span>

  </button>
        <button className={`${styles.navButton} ${isActive2('section2') ? styles.activeButton : ''}`} onClick={() => toggleSection('section2')}>
  <i className="fas fa-bell"></i>
  {/* Notification Count Badge */}
  {notifications.filter(notification => !notification.is_read).length > 0 && (
    <span className={styles.notificationBadge}>
      {notifications.filter(notification => !notification.is_read).length}
    </span>
  )}
  <span className={styles.sidespans}>Notification</span>
</button>





  <button className={`${styles.navButton} ${isActive2('section1') ? styles.activeButton : ''}`} onClick={() => toggleSection('section1')}>
        <i className="fas fa-clipboard"></i>
    <span style={{textDecoration : "underline"}} className={styles.sidespans}>Orders</span>
  </button>




  <button className={styles.navButton}>
  <Link style={{textDecoration : 'none',color : 'inherit'}} href={'/fav'}>
    <i className={`fas fa-star`}></i>
    <span className={styles.sidespans}>Favourite</span>
    </Link>
  </button>

  <button className={styles.navButton}>
  <Link style={{ color: 'inherit', textDecoration: 'none' }} href="/liked">
    <i className="fas fa-heart"></i>
    <span className={styles.sidespans}>Liked</span>
    </Link>
  </button>


  <button className={`${styles.navButton} ${isActive2('section3') ? styles.activeButton : ''}`} onClick={() => toggleSection('section3')}>
    <i className={`fas fa-gift`}></i>
    <span className={styles.sidespans}>Gift</span>
  </button>


        </div>
      </div>

      {/* Main Content */}
      <main>


      {isSearching ? (
  <div className={`col-6 ${styles.theChild2}`} >
    <button
    className={styles.searchoff}
      onClick={() => setIsSearching(false)}

    >
      ✖
    </button>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    {loading && <p>Loading...</p>}
    <div>
      {posts.length > 0 && (
        <div className={styles1.fullWidthPostsContainer}>
    
    {posts && posts.length > 0 ? (
      posts.map((post) => (
        <div key={post.id} className={styles1.fullWidthPost}>
          {/* Image Section */}
          <Link href={`../viewpost/${post.id}`}>
          <div className={styles1.fullWidthImageContainer}>
            
            <img
              src={post.design.image_url}
              alt={`Post ${post.id}`}
              className={post.design.type === 'customed rubber case' ? styles1.rubberimg : styles1.clearimg}
            />
          </div>
          </Link>
  
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
              
            </div>
  
            {/* Add to Cart Button */}
  
          </div>
        </div>
      ))
    ) : (
      <p>No posts available</p>
    )}
  </div>
      )}
      {users.length > 0 && (
        <div className={styles3.usermaincontainer} >
   
        <div className={styles3.usercontainer}>
          {users.map((user) => (
  <div className={styles3.user_card} key={user.user_id}>
  {/* Profile Section */}
  <div className={styles3.profile_section}>
    <img src={user.profile_pic} alt="Profile" className={styles3.profile_pic} />
    <div className={styles3.user_info}>
      <h3 className={styles3.username}>{`${user.first_name} ${user.last_name}`}</h3>
      <p className={styles3.user_id}>@{user.username}</p>
    </div>
  </div>

  {/* Likes and Bio Section */}
  <div className={styles3.likes_section}>
      <div className={styles3.total}>

    <p><span className={styles3.likes_count}>{user.total_posts}</span> Posts</p>
    <p>
      <span className={styles3.likes_count}>{user.total_likes}</span> Likes
      
    </p>
    </div>
    <p className={styles3.bio}>
      "Get In Touch, See What's Up With {user.first_name}"
    </p>
  </div>

  {/* Follow Button */}


  {/* Hover Details Section */}
  <div className={styles3.hover_section}>
    <h4>Contact Info</h4>
    <p>Email: {user.email}</p>
    <Link href={loggedInUsername === user.id ? '../profile/' : `../other_profile/${user.id}`}>
    <button className={styles3.follow_btn}>
  <i className="fas fa-door-closed"></i>Visit Profile
  </button>
  </Link>
  </div>
</div>
          ))}
        </div>
      </div>
      )}
      {posts.length === 0 &&
        users.length === 0 &&
        !loading &&
        !error && <p>No results found.</p>}
    </div>
  </div>
) : (
  <div className={`col-6 ${styles.theChild}`}>{children}</div>
)}

      



      <div className={`${styles.overlay} ${isSectionActive ? styles.active : ''}`} onClick={() => setActiveSection(null)}></div>
      {/* Sliding Sections */}
      <div
        className={`${styles.section} ${styles.section1} ${activeSection === 'section1' ? styles.active : ''}`}
        style={{ right: activeSection === 'section1' ? '0' : '-300px' }}
      >
  <div className={styles0.container}>
      <h1 className={styles0.title}>Your Orders</h1>
      {orders.length === 0 ? (
        <p className={styles0.noOrdersMessage}>You have no orders yet.</p>
      ) : (
        <div className={styles0.tableWrapper}>
          <table className={styles0.ordersTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Design Image</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Total Price</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className={styles0.orderRow}
                  onClick={() => handleOrderClick(order)}
                >
                  <td>{order.id}</td>
                  <td>
                    <img src={order.image_url} alt="Order design" />
                  </td>
                  <td>{order.first_name}</td>
                  <td>{order.last_name}</td>
                  <td>{order.phone_number}</td>
                  <td>{order.address}</td>
                  <td>{order.price * order.quantity}</td>
                  <td>{order.quantity}</td>
                  <td className={`${styles.status} ${styles[order.status]}`}>
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}



      {/* Conditionally render the selected order details */}

    </div>
      </div>



      <div
  className={`${styles.section} ${styles.notficationsec}  ${activeSection === 'section2' ? styles.active : ''}`}
  style={{ right: activeSection === 'section2' ? '0' : '-300px' }}
>
  <div>
    <h1 className={styles.title}>Notifications</h1>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <ul className={styles.notificationList}>
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`${styles.notificationItem} ${notification.is_read ? styles.read : styles.unread}`}
          >
            <div className={styles.notificationText}>
              <strong>{notification.message}</strong>
            </div>
            <i
              className={`fas fa-trash-alt ${styles.deleteIcon}`}
              onClick={() => deleteNotification(notification.id)}
            ></i>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>

<div
  className={`${styles.section} ${styles.section3} ${activeSection === 'section3' ? styles.active : ''}`}
  style={{ right: activeSection === 'section3' ? '0' : '-300px' }}
>
  <h3>Explore And Discover</h3>
  <p>Discover & browse top picks that make the perfect gifts and designs</p>
  
  <div className={`mb-3 ${styles.twoimgsec}`}>
    <img src="../TheStyle/ad3986e1b3e47f56536327bd782a9fa0.jpg" alt="" />
    <img src="../TheStyle/9c6bcc1c3604a809b167cd2dad8dee85.jpg" alt="" />
  </div>

  <div className="mb-5" style={{ width: '100%', display: 'flex', justifyContent: "center", flexDirection: 'column', alignItems: 'center' }}>
    <h3 className={`${styles.h3idk}`}>Start Your Journey From Here</h3>
    <button className={styles.btn5}>Browse Now</button>
  </div>

  <div>
    <div className={styles.sec3H}>
      <div className={styles.imageContent}>
        <img src="../TheStyle/il_600x600.5881472972_a319.webp" alt="" />
        <span>Content 1</span>
      </div>
      <div className={styles.imageContent}>
        <img src="../TheStyle/il_794xN.6479298676_ragh.avif" alt="" />
        <span>Content 2</span>
      </div>
    </div>

    <div className={styles.sec3H}>
      <div className={styles.imageContent}>
        <img src="../TheStyle/il_794xN.6236910131_6ppx.avif" alt="" />
        <span>Content 3</span>
      </div>
      <div className={styles.imageContent}>
        <img src="../TheStyle/wircbgiecz1c1a4wrlbs.png" alt="" />
        <span>Content 4</span>
      </div>
    </div>

  </div>
  <div  style={{ width: '100%', display: 'flex', justifyContent: "center", flexDirection: 'column', alignItems: 'center' }} className={styles.lastinsec3}>
  <button className={styles.btn5}>Browse Now</button>
  </div>
</div>

<div 
className={`${styles.section} ${styles.section4} ${activeSection === 'section4' ? styles.active : ''}`} style={{ right: activeSection === 'section3' ? '0' : '-300px' }}>
<h2>Which Case Whould You Like To Have</h2>

<div>
  <div className={styles.secondmainart}>
    
    <div>
      <h3>Customed rubber Cases</h3>
      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eligendi, expedita soluta suscipit, maiores eveniet necessitatibus molestiae voluptate id quidem qui esse dicta repellendus, perferendis officiis quasi eaque enim. Laboriosam, voluptate?</p>
      <Link href={'/createrubber'}><button className={styles.btn5}>Create Now</button></Link>
    </div>
    <img src="../TheStyle/09e0bb32f7b9951f70a473d0e5c40dde.jpg" alt="" />
  </div>

  <div className={styles.secondmainart2}>
  <img src="../TheStyle/54ccf6894c96d8f4cb828472c1ee317f.jpg" alt="" />
    <div>
      <h3>Customed Clear Cases</h3>
      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eligendi, expedita soluta suscipit, maiores eveniet necessitatibus molestiae voluptate id quidem qui esse dicta repellendus, perferendis officiis quasi eaque enim. Laboriosam, voluptate?</p>
     <Link href={'/createclear'}><button className={styles.btn5}>Create Now</button></Link>
    </div>
    
  </div>
 
</div>
</div>
      </main>

      <footer className={styles.thefooter}>
        <div style={{display : 'flex' ,flexDirection : 'row'}}>
      <div className={styles.linksholder}>
        <p>Shop</p>
        <a href="#">Guides</a>
        <a href="#">Fan Art</a>
        <a href="/blog">Blog</a>
        <a href="#">Student Discount</a>
        <a href="/login">Login</a>
        <a href="/register">Sign Up</a>
        
      </div>
      <div className={styles.linksholder}>
        <p>About</p>
        <a href="#">About Us</a>
        <a href="/about">Social Responsibility</a>
        <a href="#">Affiliates</a>
        <a href="#">Sell Your Art</a>
        <a href="#">Jobs</a>
        <a href="#">Artist Blog</a>
      </div>
      <div className={styles.linksholder}>
        <p>Help</p>
        <a href="#">Delivery</a>
        <a href="#">Returns</a>
        <a href="#">Help Center</a>
        <a href="#">Guidelines</a>
        <a href="#">Copyright</a>
        
        <a href="/contactus">Contact Us</a>
        
      </div>

      <div className={styles.linksholder}>

        <p>Social</p>
        <a href="https://www.instagram.com/"><i className="fab fa-instagram"></i> Instagram</a>
        <a href="https://www.facebook.com/"><i className="fab fa-facebook"></i> Facebook</a>
        <a href="https://www.x.com/"><i className="fab fa-twitter"></i> Twitter</a>
        <a href="https://www.tiktok.com/"><i className="fab fa-tiktok"></i> TikTok</a>
        <a href="https://www.snapchat.com/"><i className="fab fa-snapchat"></i> Snapchat</a>
      </div>
      </div>
    </footer>




      
      </div>
      
    );
  }
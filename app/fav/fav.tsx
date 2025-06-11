'use client';

import React, { useEffect, useState,useRef } from 'react';
import styles2 from '../BuyingChart/chart.module.css'
import styles4 from '../createrubber/rubber.module.css'

import styles from '../fyp/fyp.module.css'
import styles3 from '../createrubber/rubber.module.css';

import Layout from '../fyp/layout';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);




  

  



  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState<string | null>(null);

const [selectedPost, setSelectedPost] = useState<any | null>(null); // Track the selected post
const [commentContent, setCommentContent] = useState<string>("");

const [userDesigns, setUserDesgins] = useState<any[]>([]);
const [selecteduserDesign, setSelecteduserDesign] = useState<any | null>(null); // Track the selected post

const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
const [mostLiked, setMostLiked] = useState(false);
const [mostAddedToCart, setMostAddedToCart] = useState(false);
const [commentsVisible, setCommentsVisible] = useState(false);

const isFirstRender = useRef(true);
const [isFavorite, setIsFavorite] = useState(false);
const slidersRef = useRef([]); // Array of refs to store each slider's ref
const topRef = useRef<HTMLDivElement | null>(null);

const [historyStack, setHistoryStack] = useState([]);
const [theSavedDesign, setTheSavedDesign] = useState()
const router = useRouter()
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login if there's no token
        router.push('/login');
        return;
    } 
  },[router])

  
  useEffect(() => {
    // Fetch the user's favorite designs
    const fetchFavorites = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/favorites/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites);
        console.log(data)
      } else {
        console.error('Failed to fetch favorites');
      }

      setLoading(false);
    };

    fetchFavorites();
  }, []);
  function handDesignleBack(){
    setTheSavedDesign(null)
  }
  const handleDesignClick = async (design: any) => {
    setSelecteduserDesign(design); // Save the selected design to state
    const token = localStorage.getItem("token");
  
    try {
      // Fetch detailed design data
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/design/${design.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Design:", data.price); // Log the fetched design data
        setTheSavedDesign(data); // Update the state with the fetched design
      } else {
        console.error("Failed to fetch design data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading spinner or indicator
    }
  
    // Smooth scrolling to the top
    if (topRef.current) {
      topRef.current.scrollIntoView({
        behavior: "smooth", // Smooth scrolling
        block: "start",     // Align to the top of the element
        inline: "nearest",  // Prevent horizontal scrolling
      });
    }
  };

  const addToCart = async (designId : any) => {
    const token = localStorage.getItem('token')
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


const deleteFavorite = async (postId: number) => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/delete-fav/${postId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      alert('Removed from favorites!');
      setFavorites((prev) => prev.filter((d) => d.id !== postId));
           window.location.reload();

    } else {
      const data = await response.json();
      alert(data.error || 'Something went wrong');
    }
  } catch (error) {
    console.error('Error removing favorite:', error);
    alert('Error removing favorite.');
  }
};
  
  if(theSavedDesign){
    return(
      <div>
      <Layout>
        
      <div className={styles3.sevedcontainr}>
      <div
          style={{
            position: "absolute",
            top: theSavedDesign.type === 'customed rubber case' ? "-1%" : "0%",
          }}
          ref={topRef}
        ></div>
          <div className={styles3.savedimgdiv}>
          <img src={theSavedDesign.image_url} className={theSavedDesign.type === 'customed clear case'? styles3.clearimg : styles3.rubberimg} alt="" />
          </div>
  
          <div className={styles3.sevedinfos}>
  
          <h1>preview : </h1>
  
          <h2>price : {theSavedDesign.price}$</h2>
          <h3>Created By : {theSavedDesign.user}</h3>
          
          <h3>type : {theSavedDesign.type}</h3>
          <h3>model : {theSavedDesign.modell}</h3>
  
              <h3>product id : {theSavedDesign.id}</h3>
              
  
  
              <h3 style={{color : theSavedDesign.stock === "Out of Stock"? "red" : 'var(--thirdColor)', fontWeight : "bolder",textTransform : "uppercase"}}>{theSavedDesign.stock}</h3>
              <div className={styles3.savedbuttons}>
              

      
      <button onClick={() => addToCart(theSavedDesign.id)}><span>Add to Chart</span></button>
      <button onClick={handDesignleBack} className={`${styles3.transparent} ${styles3.fab}`}><span>Leave It for Now</span></button>

     
     <Link style={{width:'100%', display : theSavedDesign.stock === "Out of Stock"? "none" : 'block', fontWeight : "bolder"}} href={`/ordernow/${theSavedDesign.id}`}><button style={{width:'100%'}} className={styles4.order_now}><span>Order Now</span></button></Link>
   
  
              </div>
  
             
          </div>
          
      </div>
      </Layout>
      </div>
    )
  }
  return (
    <Layout>
    <h2 className={styles2.h2title}>Your Favorite Designs</h2>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <div className={styles2.viewsectionD}>
        {favorites.map((design) => (
          <div key={design.id} className={`${styles2.cards}`}>
            <div
              className={styles2.imgBack}
              onClick={() => handleDesignClick(design)}
            >
              <img
                src={design.image_url}
                alt={design.modell}
                className={
                  design.type ==="customed rubber case" ? styles2.instockwidth : styles2.outstockwidth
                }
                style={{ borderRadius: '8px' }}
              />
            </div>

            <div
              className={styles2.cardsContent}
              onClick={() => handleDesignClick(design)}
            >
              <h2 className={`${styles2.title}`}>
                {design.modell[2] === 'o'
                  ? design.modell.slice(0, 2) + design.modell.slice(3)
                  : design.modell}
              </h2>
              <p className={`${styles2.disc}`}>{design.type}</p>
              <p className={`${styles2.title2}`}>
                Price: ${design.price}
              </p>

            </div>
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <button
                className={styles2.btn5}
                onClick={() => deleteFavorite(design.id)}
              >
                Remove
              </button>
              <button
                className={styles2.Mainbtn5}
                onClick={() => handleDesignClick(design)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </Layout>
  );
};

export default FavoritesPage;

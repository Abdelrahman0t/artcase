"use client";
// @ts-ignore



import React, { useState, useEffect,useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { div } from 'three/webgpu';
import styles2 from './chart.module.css'
import styles from '../fyp/fyp.module.css'
import styles3 from '../createrubber/rubber.module.css';
import styles4 from '../createrubber/rubber.module.css'
import Layout from '../fyp/layout';


type CartItem = {
  id: string; // or number, depending on your backend
  price: number;
  user: string;
  stock: string;
  design: {
    id: string; // or number
    image_url: string;
    modell: string;
    type: string;
    sku?: string;
    stock : string;
  };
};


const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] =useState<any | null>(null)
const topRef = useRef<HTMLDivElement | null>(null);

  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setaddress] = useState("");
  const [city, setcity] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [theSku, setTheSku] = useState<any>(null)



  const router = useRouter()
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login if there's no token
        router.push('/login');
        return;
    } 
    fetchCartItems();
  },[router])

  const handlePostClick = (item: any) => {
    setSelectedItem(item);
    // Fetch comments when post is clicked
  };

  const handleBack = () => {
    setSelectedItem(null); // Return to the post list
  };


  const fetchCartItems = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/view/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Replace with your token retrieval method
        },
      });



      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
        console.log(data)
      } else {
        alert('Failed to fetch cart items.');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (selectedItem) {
      setTheSku(selectedItem.design?.sku || "");
     
    }
    
  }, [selectedItem]);

  useEffect(() => {
    console.log(theSku); // Logs the updated theSku value after it changes
  }, [theSku]);

  const deleteCartItem = async (cartId : any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/delete/${cartId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Replace with your token retrieval method
        },
      });

      if (response.ok) {
        alert('Item removed from cart.');
        fetchCartItems(); // Refresh the cart after deletion
      } else {
        alert('Failed to remove item.');
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (cartItems.length === 0) {
    return <p>Your cart is empty.</p>;
  }





  function handleDesignleBack(){
    setSelectedItem(null)
  }





  if (selectedItem) {
    return (
      <div>
        <Layout>
          <div className={styles3.sevedcontainr}>
            <div
              style={{
                position: "absolute",
                top: selectedItem.type === 'customed rubber case' ? "-1%" : "0%",
              }}
              ref={topRef}
            ></div>
            <div className={styles3.savedimgdiv}>
              <img
                src={selectedItem.design.image_url}
                className={selectedItem.design.type === 'customed clear case' ? styles3.clearimg : styles3.rubberimg}
                alt=""
              />
            </div>

            <div className={styles3.sevedinfos}>
              <h1>preview : </h1>
              <h2>price : {selectedItem.price}$</h2>
              <h3>Created By : {selectedItem.user}</h3>
              <h3>type : {selectedItem.design.type}</h3>
              <h3>model : {selectedItem.design.modell}</h3>
              <h3>product id : {selectedItem.design.id}</h3>
              <h3
                style={{
                  color: selectedItem.stock === "Out of Stock" ? "red" : 'var(--thirdColor)',
                  fontWeight: "bolder",
                  textTransform: "uppercase",
                }}
              >
                {selectedItem.stock}
              </h3>
              

              <div className={styles3.savedbuttons}>
                <button onClick={handleDesignleBack} className={`${styles3.transparent} ${styles3.fab}`}>
                  <span>Leave It for Now</span>
                </button>

         {/*
              <button
        className={`${styles3.savedbuttons} ${styles3.deletefinaldesign}`}
        onClick={() => deleteCartItem(item.id)}
      >
        Remove
      </button>
*/}

                <Link
                  style={{
                    width: '100%',
                    display: selectedItem.design.stock === "Out of Stock" ? "none" : 'block',
                    fontWeight: "bolder",
                  }}
                  href={`/ordernow/${selectedItem.design.id}`}
                >
                  <button style={{ width: '100%' }} className={styles4.order_now}>
                    <span>Order Now</span>
                  </button>
                </Link>


                
              </div>
            </div>
          </div>
        </Layout>
      </div>
    );
  }



   
  

  

  return (
    <Layout>
      <div>
      <h2 className={styles2.h2title}>Your Cart</h2>
<div className={styles2.viewsectionD} >

  {cartItems.map((item) => (
    <div key={item.id} className={`${styles2.cards}`}>
      <div className={styles2.imgBack} onClick={() => handlePostClick(item)}>
        <img
          src={item.design.image_url}
          alt={`Item ${item.id}`}
          className={item.design.type === 'customed rubber case' ? styles2.instockwidth : styles2.outstockwidth}
          style={{ borderRadius: '8px' }}
        />
      </div>

      <div className={styles2.cardsContent} onClick={() => handlePostClick(item)}>
        <h2 className={`${styles2.title}`}>
          {item.design.modell[2] === 'o' 
            ? item.design.modell.slice(0, 2) + item.design.modell.slice(3) 
            : item.design.modell}
        </h2>
        <p className={`${styles2.disc}`}>{item.design.type}</p>

        <p className={`${styles2.title2}`}>
          Price: {item.price}$
        </p>
      </div>
      <div style={{display : "flex" , width : "100%", justifyContent :"center", gap:  "10px"}}>
      <button
        className={styles2.btn5}
        onClick={() => deleteCartItem(item.id)}
      >
        Remove
      </button> 
      <Link href={`ordernow/${item.design.id}`} style={{display : item.design.stock === 'Out of Stock'? "none":'block'}}>
      <button
        className={styles2.Mainbtn5}
        
      >
        Order
      </button>
      </Link>
      </div>
    </div>
  ))}

  {/*       <button
        className={styles2.btn5}
        onClick={() => deleteCartItem(item.id)}
      >
        Remove from Cart
      </button> */}

</div>


</div>
   
    </Layout>
  );
};

export default CartPage;

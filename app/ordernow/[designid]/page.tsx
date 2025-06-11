
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';  // Import the useRouter hook
import Image from 'next/image';
import Link from 'next/link';
import styles1 from './order.module.css'; // Import the CSS module


// Manual JWT decoding function
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

interface DesignProps {
  params: {
    designid: string;
  };
}

const DesignPage = ({ params }: DesignProps) => {
  const [design, setDesign] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);  // Store the username
  const [quantity, setQuantity] = useState(1);  // Default quantity is 1
  const [error, setError] = useState(false);
  const router = useRouter();  // Initialize the router for navigation
    const [country, setCountry] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setaddress] = useState("");
    const [city, setcity] = useState("");
        const [phoneNumber, setPhoneNumber] = useState("");
  // Get the dynamic design ID from the URL parameter
  const { designid } = params;

  // Retrieve the token from localStorage or your global state
  const token = localStorage.getItem('token');  // Assuming token is stored in localStorage



  useEffect(()=>{
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login if there's no token
        router.push('/login');
        return;
    } 
  },[router])

  useEffect(() => {
    // Decode the token to get the user ID using the manual decodeJwt function
    let decodedUserId = null;
    if (token) {
      const decoded: any = decodeJwt(token);  // Decode the token manually
      decodedUserId = decoded.user_id;  // Assuming the token has 'user_id' as the identifier
      console.log('Decoded User ID:', decodedUserId);  // Log the decoded user ID

      // Fetch the username from the backend using the decoded user ID
      const fetchUsername = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${decodedUserId}/`, {
            headers: {
              'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
            }
          });
          if (response.ok) {
            const data = await response.json();
            setUsername(data.username);  // Assuming the API returns a 'username' field
            console.log('Fetched Username:', data.username);
          } else {
            console.error('Failed to fetch username');
          }
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      };

      fetchUsername();  // Fetch the username after decoding the token
    }

    // Fetch design data from your backend or API based on the designid
    const fetchDesignData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/design/${designid}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
          }
        });
        if (response.ok) {
          const data = await response.json();
          setDesign(data);
          console.log('Fetched Design:', data);  // Log the fetched design data
        } else {
          console.error('Failed to fetch design data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesignData();
  }, [designid, token]);  // Run the effect when designid or token changes

  // Use another effect to check after the design has been set




  const handleOrder = async () => {
    if (!design) {
      alert("Design data is missing. Please try again.");
      return;
    }

    const token = localStorage.getItem("token");
    const orderDetails1 = {
      design: design.id,
      phone_number: phoneNumber,
      address,
      city,
      country,
      firstname: first_name,
      lastname: last_name,
      email,
      sku: design.sku,
    };

    const orderDetails2 = {
      id: design.id,
      image_url: design.image_url,
      type: design.type,
      modell: design.modell,
      stock: design.stock,
      phone_number: phoneNumber,
      address,
      city,
      country,
      first_name: first_name,
      last_name: last_name,
      email,
      sku: design.sku,
      price: design.price,
      quantity,
    };

    try {
      // Send to first API


      // If first API succeeds, send to second API
      const response2 = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/createOrder/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderDetails2),
        }
      );

      if (!response2.ok) {
        const errorData = await response2.json();
        console.error("Failed to place order in second API:", errorData);
        alert("Failed to finalize order. Please try again.");
        return;
      }

      console.log("Second order API success!");
      alert("Your order has been placed!");
      router.push("/fyp");

    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing your order.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error || !design) return <div>Error loading design. Please try again.</div>;



  return (
    <div className={styles1.container}>
      <div className={styles1.designDetails}>
      <div className={`${styles1.imageContainer} ${design?.type === "customed rubber case" ? styles1.rubberH : ""}`}>

          <img src={design?.image_url || "/placeholder.png"} alt="Design preview" />
        </div>
        <div className={styles1.info}></div>
      </div>

      <div className={styles1.orderForm}>
        <h2>Place Your Order</h2>
        <div className={styles1.formGroup}>
          <input type="text" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} />
          <input type="text" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} />
        </div>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Phone Number" onChange={(e) => setPhoneNumber(e.target.value)} />
        <div className={styles1.formGroup}>
          <input type="text" placeholder="Country" onChange={(e) => setCountry(e.target.value)} />
          <input type="text" placeholder="City" onChange={(e) => setcity(e.target.value)} />
        </div>
        <input type="text" placeholder="Address" onChange={(e) => setaddress(e.target.value)} />
        <div className={styles1.formGroup}>
          <input
            type="number"
            placeholder="Quantity"
            min="1"
            max="9"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>
        <button onClick={handleOrder}>Order Design</button>
      </div>
    </div>
  );
};

export default DesignPage;

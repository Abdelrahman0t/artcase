'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./orderlist.module.css";
import { div } from "three/webgpu";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);  // Store the orders data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null); // Store the selected order

  const router = useRouter();

  // Fetch the orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login"); // Redirect to login page if not authenticated
        return;       
      }

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

 function cancilselect(){
    setSelectedOrder(null)
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Handle click on order row to view details
  const handleOrderClick = (order: any) => {
    setSelectedOrder(order); // Set the selected order to show its details
  };


  const cancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      router.push("/login");
      return;
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cancelOrder/${orderId}/`, {
        method: "PATCH",  // Make sure you're sending PATCH
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });   
  
      if (!response.ok) {
        throw new Error("Failed to cancel the order");
      }
  
      const data = await response.json();
      setOrders(orders.filter((order) => order.id !== orderId)); // Remove canceled order from the list
      setSelectedOrder(null); // Reset selected order
      alert(data.message); // Show success message
    } catch (error) {
      alert("An error occurred while canceling the order.");
    }
  };
  


if(selectedOrder){
    return(
        <div className={styles.orderDetails}>
          <div className={styles.card}>
            <div className={styles.cardImage}>
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
                <p><strong>Price:</strong> ${selectedOrder.price}</p>
                <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
              </div>
              <div className={styles.cardFooter}>
                <button onClick={cancilselect} className={styles.backButton}>
                  Back to Orders
                </button>

              </div>  
            </div>
          </div>
        </div>
    )
}
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Orders</h1>
      {orders.length === 0 ? (
        <p className={styles.noOrdersMessage}>You have no orders yet.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Design Image</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className={styles.orderRow}
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
                  <td>{order.price}</td>
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
  );
};

export default OrdersPage;

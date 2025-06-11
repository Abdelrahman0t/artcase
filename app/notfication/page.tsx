
'use client';

import React, { useEffect, useState } from 'react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications on component mount
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
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
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

  return (
    <div>
      <h1>Notifications</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              style={{
                padding: '10px',
                backgroundColor: notification.is_read ? '#f0f0f0' : '#e0f7fa',
              }}
            >
              <div>
                <strong>{notification.message}</strong>
                <div>
                  <small>{new Date(notification.created_at).toLocaleString()}</small>
                </div>
              </div>
              <button
                onClick={() => markAsRead(notification.id)}
                disabled={notification.is_read} // Button disabled if notification is already read
              >
                {notification.is_read ? 'Read' : 'Mark as Read'}
              </button>
              <button onClick={() => deleteNotification(notification.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Check, Trash2, ArrowLeft, Filter } from 'lucide-react';
import styles from './notification.module.css';

interface Notification {
  id: number;
  message: string;
  type: 'like' | 'comment' | 'follow' | 'order' | 'system';
  is_read: boolean;
  created_at: string;
  user_avatar?: string;
  user_name?: string;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: 1,
      message: "John Doe liked your iPhone 15 Clear Case design",
      type: 'like',
      is_read: false,
      created_at: '2024-01-15T10:30:00Z',
      user_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      user_name: 'John Doe'
    },
    {
      id: 2,
      message: "Sarah commented on your Galaxy S24 Rubber Case",
      type: 'comment',
      is_read: false,
      created_at: '2024-01-15T09:15:00Z',
      user_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      user_name: 'Sarah Wilson'
    },
    {
      id: 3,
      message: "Mike started following you",
      type: 'follow',
      is_read: true,
      created_at: '2024-01-14T16:45:00Z',
      user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      user_name: 'Mike Johnson'
    },
    {
      id: 4,
      message: "Your order #12345 has been shipped",
      type: 'order',
      is_read: true,
      created_at: '2024-01-14T14:20:00Z'
    },
    {
      id: 5,
      message: "Welcome to ArtCase! Start creating your first design",
      type: 'system',
      is_read: true,
      created_at: '2024-01-13T12:00:00Z'
    }
  ];

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, use mock data
        setNotifications(mockNotifications);
        
        // Uncomment when backend is ready:
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/`, {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //   },
        // });

        // if (response.ok) {
        //   const data = await response.json();
        //   setNotifications(data.notifications);
        // } else {
        //   console.error('Failed to fetch notifications');
        // }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      // Update local state immediately for better UX
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );

      // Uncomment when backend is ready:
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/${notificationId}/read/`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //   },
      // });

      // if (!response.ok) {
      //   alert('Failed to mark notification as read');
      // }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: number) => {
    try {
      // Update local state immediately for better UX
      setNotifications((prevState) =>
        prevState.filter((notification) => notification.id !== notificationId)
      );

      // Uncomment when backend is ready:
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/${notificationId}/delete/`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //   },
      // });

      // if (!response.ok) {
      //   console.error('Failed to delete notification');
      // }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.is_read;
    if (filter === 'read') return notification.is_read;
    return true;
  });

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      case 'order':
        return '📦';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
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

            {/* Header Actions */}
            <div className={styles.headerActions}>
              <Link href="/newprofile" className={styles.headerButton}>
                <ArrowLeft className={styles.headerButtonIcon} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.mainContainer}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Notifications</h1>
          <p className={styles.pageSubtitle}>Stay updated with your latest activities</p>
        </div>

        {/* Filter Buttons */}
        <div className={styles.filterContainer}>
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'unread' ? styles.active : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({notifications.filter(n => !n.is_read).length})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'read' ? styles.active : ''}`}
            onClick={() => setFilter('read')}
          >
            Read ({notifications.filter(n => n.is_read).length})
          </button>
        </div>

        {/* Notifications Container */}
        <div className={styles.notificationsContainer}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <p className={styles.loadingText}>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className={styles.emptyState}>
              <Bell className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>
                {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
              </h3>
              <p className={styles.emptyText}>
                {filter === 'all' 
                  ? 'You\'ll see notifications about likes, comments, and other activities here'
                  : `You don't have any ${filter} notifications at the moment`
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.notificationCard} ${notification.is_read ? styles.read : styles.unread}`}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <div className={styles.notificationContent}>
                  <div className={styles.notificationText}>
                    <div className={styles.notificationMessage}>
                      <span style={{ marginRight: '0.5rem' }}>
                        {getNotificationIcon(notification.type)}
                      </span>
                      {notification.message}
                    </div>
                    <div className={styles.notificationTime}>
                      {formatTime(notification.created_at)}
                    </div>
                  </div>
                  
                  <div className={styles.notificationActions}>
                    {!notification.is_read && (
                      <button
                        className={`${styles.actionButton} ${styles.markReadButton}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        <Check className={styles.actionIcon} />
                        Mark Read
                      </button>
                    )}
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <Trash2 className={styles.actionIcon} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

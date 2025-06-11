import { getAuthHeaders } from './apiUtils';

// Types
export interface AdminAnalytics {
  orders: {
    total: number;
    revenue: number;
    status_distribution: Array<{
      status: string;
      count: number;
    }>;
  };
  users: {
    total: number;
    active: number;
  };
  reports: {
    total: number;
    pending: number;
  };
}

export interface Report {
  id: number;
  content_id: number;
  content_type: 'post' | 'comment';
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  reported_by: string;
  created_at: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'published' | 'archived';
  publish_date: string | null;
  created_at: string;
  updated_at: string;
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Reports API
export const fetchReports = async (): Promise<Report[]> => {
  const response = await fetch(`${API_BASE_URL}/api/reports/`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have permission to access reports');
    }
    throw new Error('Failed to fetch reports');
  }

  return response.json();
};

export const updateReportStatus = async (reportId: number, action: 'resolve' | 'dismiss'): Promise<Report> => {
  const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}/status/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ action }),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have permission to update reports');
    }
    throw new Error('Failed to update report status');
  }

  return response.json();
};

// Announcements API
export const fetchAnnouncements = async (): Promise<Announcement[]> => {
  const response = await fetch(`${API_BASE_URL}/api/announcements/`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have permission to access announcements');
    }
    throw new Error('Failed to fetch announcements');
  }

  return response.json();
};

export const createAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>): Promise<Announcement> => {
  const response = await fetch(`${API_BASE_URL}/api/announcements/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(announcement),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have permission to create announcements');
    }
    throw new Error('Failed to create announcement');
  }

  return response.json();
};

export const updateAnnouncementStatus = async (announcementId: number): Promise<Announcement> => {
  const response = await fetch(`${API_BASE_URL}/api/announcements/${announcementId}/status/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have permission to update announcements');
    }
    throw new Error('Failed to update announcement status');
  }

  return response.json();
};

// Analytics API
export const fetchAnalytics = async (startDate?: string, endDate?: string): Promise<AdminAnalytics> => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/?${params.toString()}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have permission to access analytics');
    }
    throw new Error('Failed to fetch analytics');
  }

  return response.json();
};

// Orders API
export const updateOrderStatus = async (orderId: number, status: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have permission to update orders');
    }
    throw new Error('Failed to update order status');
  }

  return response.json();
};

// Users API
export const updateUserStatus = async (userId: number, status: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/status/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have permission to update users');
    }
    throw new Error('Failed to update user status');
  }

  return response.json();
}; 
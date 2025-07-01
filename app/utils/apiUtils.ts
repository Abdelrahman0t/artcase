import { jwtDecode } from 'jwt-decode';

// Types
export interface Post {
  id: number;
  caption: string;
  description: string;
  created_at: string;
  user_id: number;
  first_name: string;
  last_name: string;
  profile_pic: string;
  design: {
    id: number;
    image_url: string;
    theclass: string;
    type: string;
    stock: string;
    modell: string;
    price: number;
  };
  like_count: number;
  favorite_count: number;
  is_liked: boolean;
  is_favorited: boolean; // Changed from is_favorite to is_favorited
  comments: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  user_id: number;
  post_id: number;
  created_at: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
}

export interface LeaderboardUser {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_pic: string;
  total_likes?: number;
  total_posts?: number;
}

export interface LeaderboardData {
  likesData: LeaderboardUser[];
  postsData: LeaderboardUser[];
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Auth Utils
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const handleUnauthorized = () => {
  alert('You have to be logged in');
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

export const decodeJwt = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// API Calls
export const fetchPublicPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public-posts/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch public posts.");
  }

  return response.json();
};

export async function fetchMostLikedDesigns() {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/most-liked-designs/`, {
    headers,
  });
  if (!res.ok) throw new Error('Failed to fetch most liked designs');
  return await res.json();
}

export const fetchMostAddedToCartDesigns = async (): Promise<Post[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/most-added-to-cart-designs/`);
  if (!response.ok) {
    throw new Error("Failed to fetch most added to cart designs");
  }
  return response.json();
};

export const fetchRecentPosts = async (): Promise<Post[]> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/recent-posts/`, {
    method: 'GET',
    headers: {
     
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to fetch posts');
  }

  return response.json();
};

export const handleLike = async (postId: number): Promise<{ message: string }> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('You must be logged in');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/like/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (response.status === 204 || response.status === 404) {
    return { message: response.status === 204 ? "Like added." : "Like removed." };
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to toggle like");
  }

  return data;
};

export const handleFavorite = async (postId: number): Promise<{ message: string }> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('You must be logged in');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/favorite/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (response.status === 204 || response.status === 404) {
    return { message: response.status === 204 ? "Favorite added." : "Favorite removed." };
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to toggle favorite");
  }

  return data;
};

export const handleCommentSubmit = async (postId: number, content: string): Promise<{ comment: Comment }> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('You must be logged in');
  }

  if (!content) {
    throw new Error("Comment content is required.");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/comment/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error("Failed to add comment");
  }

  return response.json();
};

export const handleDeleteComment = async (commentId: number): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('You must be logged in');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/${commentId}/delete/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete comment");
  }
};

export const addToCart = async (designId: number): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('You must be logged in');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/add/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ design_id: designId }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to add to cart");
  }
};

export const fetchLeaderboardData = async (): Promise<LeaderboardData> => {
  try {
    const [likesResponse, postsResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/top-users-by-likes/`),
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/top-users-by-posts/`),
    ]);

    if (!likesResponse.ok || !postsResponse.ok) {
      throw new Error('Failed to fetch leaderboard data');
    }

    const likesData = await likesResponse.json();
    const postsData = await postsResponse.json();

    return { likesData, postsData };
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return { likesData: [], postsData: [] };
  }
};

export const fetchComments = async (postId: number): Promise<Comment[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/comments/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch comments.");
  }

  const data = await response.json();
  return data.comments || [];
};

// Utility functions for redirect handling
export const setRedirectUrl = (url: string) => {
  localStorage.setItem('redirectUrl', url);
};

export const getRedirectUrl = (): string | null => {
  return localStorage.getItem('redirectUrl');
};

export const clearRedirectUrl = () => {
  localStorage.removeItem('redirectUrl');
};

export const getCurrentPageUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.pathname + window.location.search;
  }
  return '/';
}; 


export async function fetchTopUsersByLikes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/top-users-by-likes/`);
  if (!res.ok) throw new Error('Failed to fetch top users');
  return await res.json();
}
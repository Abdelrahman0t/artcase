'use client';
import React, { useState } from 'react';

function Search() {
  const [query, setQuery] = useState(''); // Search query state
  const [posts, setPosts] = useState([]); // State for post results
  const [users, setUsers] = useState([]); // State for user results
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const handleSearch = async () => {
    if (!query) return; // Don't search if no query is entered
    setLoading(true);
    setError(null);

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Trigger the search when Enter key is pressed
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown} // Detect Enter key press
        placeholder="Search for posts, designs, or users..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}
      {loading && <p>Loading...</p>} {/* Show loading state */}

      <div>
        {posts.length > 0 && (
          <div>
            <h2>Posts</h2>
            {posts.map((post) => (
              <div key={post.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
                <h3>{post.caption}</h3>
                <p>{post.description}</p>
                <img
                  src={post.design.image_url}
                  alt={post.design.modell}
                  style={{ width: '150px', height: 'auto' }}
                />
                <p>Model: {post.design.modell}</p>
                <p>Type: {post.design.type}</p>
              </div>
            ))}
          </div>
        )}

        {users.length > 0 && (
          <div>
            <h2>Users</h2>
            {users.map((user) => (
              <div key={user.username} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
                <h3>{user.username}</h3>
                <p>First Name: {user.first_name}</p>
                <p>Last Name: {user.last_name}</p>
                <img
                  src={user.profile_pic}
                  alt={user.username}
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
              </div>
            ))}
          </div>
        )}

        {posts.length === 0 && users.length === 0 && !loading && !error && <p>No results found.</p>}
      </div>
    </div>
  );
}

export default Search;

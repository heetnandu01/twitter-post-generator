import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import BookmarkDetails from './BookmarkDetails';

function Sidebar({ isCollapsed, toggleCollapse }) {
  const { user, isSignedIn } = useUser();
  const [apiKey, setApiKey] = useState(localStorage.getItem('groqApiKey') || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedBookmark, setSelectedBookmark] = useState(null);

  // Fetch bookmarks when component mounts
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (isSignedIn && user) {
        try {
          const response = await axios.get(`http://localhost:5000/api/posts/user/${user.id}`);
          setBookmarks(response.data);
        } catch (error) {
          console.error('Error fetching bookmarks:', error);
        }
      }
    };
    
    fetchBookmarks();
  }, [isSignedIn, user]);

  const handleSaveApiKey = async () => {
    // First store the API key in localStorage for client-side use
    localStorage.setItem('groqApiKey', apiKey);
    
    // Reset states
    setIsSaved(false);
    setIsError(false);
    
    // Only proceed with API call if user is signed in
    if (!isSignedIn || !user) {
      setIsError(true);
      setErrorMessage('You must be signed in to save API key to account');
      return;
    }
    
    try {
      // Send API key to backend for the current user
      const response = await axios.put(`http://localhost:5000/api/users/${user.id}`, {
        groqApiKey: apiKey
      });
      
      console.log('API key saved successfully:', response.data);
      setIsSaved(true);
      
      // Reset the "Saved!" message after 2 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving API key:', error);
      setIsError(true);
      setErrorMessage(error.response?.data?.error || 'Failed to save API key');
      
      // Reset error message after 3 seconds
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  };

  const handleDeleteBookmark = async (id) => {
    try {
      // Call the delete API endpoint
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      
      // Update local state to remove the deleted bookmark
      setBookmarks(bookmarks.filter(bookmark => bookmark._id !== id));
      
      // If the deleted bookmark was selected, close the details view
      if (selectedBookmark && selectedBookmark._id === id) {
        setSelectedBookmark(null);
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      alert('Failed to delete bookmark. Please try again.');
    }
  };

  const openBookmarkDetails = (bookmark) => {
    setSelectedBookmark(bookmark);
  };

  const closeBookmarkDetails = () => {
    setSelectedBookmark(null);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-toggle" onClick={toggleCollapse}>
        {isCollapsed ? '»' : '«'}
      </div>
      
      {!isCollapsed && (
        <div className="sidebar-content">
          <h2>Bookmarks</h2>
          {bookmarks.length > 0 ? (
            <div className="bookmarks-list">
              {bookmarks.map(bookmark => (
                <div key={bookmark._id} className="bookmark-item">
                  <div className="bookmark-header">
                    <h3 onClick={() => openBookmarkDetails(bookmark)} style={{ cursor: 'pointer' }}>
                      {bookmark.topic || 'Untitled Post'}
                    </h3>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteBookmark(bookmark._id)}
                    >
                      Delete
                    </button>
                  </div>
                  <p>{bookmark.generatedTweet.substring(0, 80)}...</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-bookmarks">No bookmarks yet</p>
          )}
          
          <div className="api-settings">
            <h2>API Settings</h2>
            <div className="input-group">
              <label>Enter your Groq API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-xxxx..."
              />
            </div>
            <button 
              className={`save-button ${isSaved ? 'saved' : ''} ${isError ? 'error' : ''}`}
              onClick={handleSaveApiKey}
            >
              {isSaved ? 'Saved!' : isError ? errorMessage : 'Save API Key'}
            </button>
          </div>
        </div>
      )}
      
      {/* The modal is rendered outside the sidebar content for proper z-indexing */}
      {selectedBookmark && (
        <BookmarkDetails 
          bookmark={selectedBookmark} 
          onClose={closeBookmarkDetails}
          onDelete={handleDeleteBookmark}
        />
      )}
    </div>
  );
}

export default Sidebar;
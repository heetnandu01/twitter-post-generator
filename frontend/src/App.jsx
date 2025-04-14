import React, { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const { user, isLoaded, isSignedIn } = useUser();
  
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Casual');
  const [audience, setAudience] = useState('General');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy');
  const [bookmarkStatus, setBookmarkStatus] = useState('Bookmark');
  const [bookmarks, setBookmarks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const toneOptions = ['Casual', 'Professional', 'Humorous', 'Serious'];
  const audienceOptions = ['General', 'Professionals', 'Tech enthusiasts', 'Students'];
  
  // Handle authentication and API request when user signs in
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // User is authenticated, make API request to your backend
      const registerUser = async () => {
        try {
          // Make API request to your backend with just the clerkId
          const response = await axios.post('http://localhost:5000/api/users/', {
            clerkId: user.id
          });
          
          console.log('User registered/logged in successfully:', response.data);
        } catch (error) {
          console.error('Error registering/logging in user:', error);
        }
      };
      
      registerUser();
      fetchBookmarks();
    }
  }, [isLoaded, isSignedIn, user]);

  // Separate function to fetch bookmarks
  const fetchBookmarks = async () => {
    if (isSignedIn && user) {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/user/${user.id}`);
        
        // Map the response data to match the bookmarks state structure
        const formattedBookmarks = response.data.map(post => ({
          id: post._id,
          content: post.generatedTweet,
          title: `Post about ${post.topic}`
        }));
        
        setBookmarks(formattedBookmarks);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    }
  };

  const handleGeneratePost = async () => {
    // Validate inputs
    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Call your backend API to generate the post
      const response = await axios.post('http://localhost:5000/api/posts/', {
        clerkId: user?.id,
        topic,
        tone,
        targetAudience: audience,
        prompt: customPrompt
      });
      
      // Set the generated tweet from the API response
      setGeneratedPost(response.data.generatedTweet);
    } catch (error) {
      console.error('Error generating post:', error.response?.data || error.message);
      
      if (error.response?.data?.message === 'Groq API key not found for this user.') {
        alert('Please enter your Groq API Key in the sidebar first');
      } else {
        alert('Error generating post. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy'), 2000);
  };
  
  const handleBookmark = async () => {
    if (!isSignedIn) {
      alert('Please sign in to bookmark posts');
      return;
    }
    
    try {
      // Call your backend API to bookmark the post
      const response = await axios.post('http://localhost:5000/api/posts/bookmark', {
        clerkId: user.id,
        topic,
        tone,
        targetAudience: audience,
        prompt: customPrompt,
        generatedTweet: generatedPost
      });
      
      // Add the new bookmark to the bookmarks state
      const newBookmark = {
        id: response.data.bookmarkedPost._id,
        content: generatedPost,
        title: `Post about ${topic}`
      };
      
      setBookmarks([...bookmarks, newBookmark]);
      setBookmarkStatus('Bookmarked!');
      setTimeout(() => setBookmarkStatus('Bookmark'), 2000);
      
      // Refresh bookmarks
      fetchBookmarks();
      
    } catch (error) {
      console.error('Error bookmarking post:', error);
      alert('Error bookmarking post. Please try again.');
    }
  };
  
  const handleDeleteBookmark = async (id) => {
    try {
      // Call your backend API to delete the bookmark
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      
      // Remove the bookmark from the bookmarks state
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
      
      // Refresh bookmarks
      fetchBookmarks();
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      alert('Error deleting bookmark. Please try again.');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Dropdown component using the improved version from separate file
  const Dropdown = ({ value, options, onChange }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = React.useRef(null);
    
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setOpen(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
    
    return (
      <div className="dropdown" ref={dropdownRef}>
        <button 
          className="dropdown-button"
          onClick={() => setOpen(!open)}
        >
          {value} <span className="dropdown-arrow">▼</span>
        </button>
        
        {open && (
          <div className="dropdown-menu">
            {options.map((option) => (
              <div 
                key={option}
                className="dropdown-item"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Show loading indicator while Clerk is initializing
  if (!isLoaded) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header className="header">
        {/* Hamburger menu for mobile */}
        <div className="hamburger" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <h1>AI Twitter Post Generator</h1>
        
        <div className="user-section">
          {user && <span className="user-name">{user.fullName || user.username}</span>}
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </header>
      
      <div className="container">
        {/* Backdrop for mobile sidebar */}
        <div 
          className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`} 
          onClick={closeSidebar}
        ></div>
        
        {/* Desktop sidebar with collapsible functionality */}
        <div className="desktop-sidebar">
          <Sidebar 
            isCollapsed={sidebarCollapsed}
            toggleCollapse={toggleSidebarCollapse}
          />
        </div>
        
        {/* Mobile sidebar */}
        <div className={`mobile-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <Sidebar 
            isCollapsed={false}
            toggleCollapse={() => {}}
          />
        </div>
        
        <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
          <section className="card categories">
            <h2>Categories</h2>
            
            <div className="input-group">
              <label>Topic</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Technology, Marketing, Personal"
              />
            </div>
            
            <div className="input-group">
              <label>Tone</label>
              <Dropdown 
                value={tone}
                options={toneOptions}
                onChange={setTone}
              />
            </div>
            
            <div className="input-group">
              <label>Target Audience</label>
              <Dropdown 
                value={audience}
                options={audienceOptions}
                onChange={setAudience}
              />
            </div>
          </section>
          
          <section className="card custom-prompt">
            <h2>Custom Prompt</h2>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your custom prompt here..."
            />
            <div className="button-container">
              <button 
                className={`generate-button ${isGenerating ? 'disabled' : ''}`} 
                onClick={handleGeneratePost}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Post'}
              </button>
            </div>
          </section>
          
          <section className="card generated-post">
            <div className="post-header">
              <h2>AI Generated Post</h2>
              <div className="post-actions">
                <button 
                  className={`action-button ${copyStatus === 'Copied!' ? 'success' : ''}`}
                  onClick={handleCopy}
                  disabled={!generatedPost}
                >
                  {copyStatus}
                </button>
                <button 
                  className={`action-button ${bookmarkStatus === 'Bookmarked!' ? 'success' : ''}`}
                  onClick={handleBookmark}
                  disabled={!generatedPost}
                >
                  {bookmarkStatus}
                </button>
              </div>
            </div>
            
            <div className="post-content">
              {isGenerating ? (
                <p className="loading-text">Generating your post...</p>
              ) : generatedPost ? (
                <p>{generatedPost}</p>
              ) : (
                <p className="placeholder-text">Your generated post will appear here.</p>
              )}
            </div>
          </section>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;
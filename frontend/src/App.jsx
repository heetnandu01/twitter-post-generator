import React, { useState } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import Footer from './components/Footer'; // Import the Footer component
import './App.css';

function App() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Casual');
  const [audience, setAudience] = useState('General');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedPost, setGeneratedPost] = useState('This is a dummy AI generated post. It would show the response from an AI model based on your inputs and custom prompt.');
  const [copyStatus, setCopyStatus] = useState('Copy');
  const [bookmarkStatus, setBookmarkStatus] = useState('Bookmark');
  const [bookmarks, setBookmarks] = useState([
    { id: 1, content: 'This is a sample bookmark post about AI technology.', title: 'Post #1' }
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toneOptions = ['Casual', 'Professional', 'Humorous', 'Serious'];
  const audienceOptions = ['General', 'Professionals', 'Tech enthusiasts', 'Students'];
  
  const [toneDropdownOpen, setToneDropdownOpen] = useState(false);
  const [audienceDropdownOpen, setAudienceDropdownOpen] = useState(false);
  
  const handleGeneratePost = () => {
    console.log('Generating post with:', { topic, tone, audience, customPrompt });
    // In a real app, we would call an API here
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy'), 2000);
  };
  
  const handleBookmark = () => {
    const newBookmark = {
      id: bookmarks.length + 1,
      content: generatedPost,
      title: `Post #${bookmarks.length + 1}`
    };
    setBookmarks([...bookmarks, newBookmark]);
    setBookmarkStatus('Bookmarked!');
    setTimeout(() => setBookmarkStatus('Bookmark'), 2000);
  };
  
  const handleDeleteBookmark = (id) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Simplified dropdown component
  const Dropdown = ({ value, options, open, setOpen, onChange }) => {
    return (
      <div className="dropdown">
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
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <header className="header">
        {/* Hamburger menu */}
        <div className="hamburger" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <h1>AI Twitter Post Generator</h1>
        
        <div className="user-section">
          {isSignedIn && user && <span className="user-name">{user.fullName || user.username}</span>}
          <UserButton />
        </div>
      </header>
      
      <div className="container">
        {/* Backdrop for mobile sidebar */}
        <div 
          className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`} 
          onClick={closeSidebar}
        ></div>
        
        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <h2>Bookmarks</h2>
          {bookmarks.length > 0 ? (
            <div className="bookmarks-list">
              {bookmarks.map(bookmark => (
                <div key={bookmark.id} className="bookmark-item">
                  <div className="bookmark-header">
                    <h3>{bookmark.title}</h3>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteBookmark(bookmark.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <p>{bookmark.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-bookmarks">No bookmarks yet</p>
          )}
        </div>
        
        <main className="main-content">
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
                open={toneDropdownOpen}
                setOpen={setToneDropdownOpen}
                onChange={setTone}
              />
            </div>
            
            <div className="input-group">
              <label>Target Audience</label>
              <Dropdown 
                value={audience}
                options={audienceOptions}
                open={audienceDropdownOpen}
                setOpen={setAudienceDropdownOpen}
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
              <button className="generate-button" onClick={handleGeneratePost}>
                Generate Post
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
                >
                  {copyStatus}
                </button>
                <button 
                  className={`action-button ${bookmarkStatus === 'Bookmarked!' ? 'success' : ''}`}
                  onClick={handleBookmark}
                >
                  {bookmarkStatus}
                </button>
              </div>
            </div>
            
            <div className="post-content">
              <p>{generatedPost}</p>
            </div>
          </section>
        </main>
      </div>
      
      {/* Footer Component */}
      <Footer />
    </div>
  );
}

export default App;
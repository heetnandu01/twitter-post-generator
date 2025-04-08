// Updated GeneratedPost.jsx
import React, { useState } from 'react';
import axios from 'axios';

function GeneratedPost({ post, topic, tone, targetAudience, prompt, userId }) {
  const [copyStatus, setCopyStatus] = useState('');
  const [bookmarkStatus, setBookmarkStatus] = useState('');
  
  const handleCopy = () => {
    navigator.clipboard.writeText(post);
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus(''), 2000);
  };
  
  const handleBookmark = async () => {
    try {
      // Call the bookmark API endpoint
      const response = await axios.post('http://localhost:5000/api/posts/bookmark', {
        clerkId: userId,
        topic: topic || 'Untitled',
        tone: tone || 'Casual',
        targetAudience: targetAudience || 'General',
        prompt: prompt || '',
        generatedTweet: post
      });
      
      setBookmarkStatus('saved');
      setTimeout(() => setBookmarkStatus(''), 2000);
      
      console.log('Post bookmarked successfully:', response.data);
    } catch (error) {
      console.error('Error bookmarking post:', error);
      alert('Failed to bookmark post. Please try again.');
    }
  };
  
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl">AI Generated Post</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className={`p-2 rounded-md ${copyStatus === 'copied' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'}`}
            title="Copy to clipboard"
          >
            {copyStatus === 'copied' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
              </svg>
            )}
          </button>
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-md ${bookmarkStatus === 'saved' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'}`}
            title="Bookmark"
          >
            {bookmarkStatus === 'saved' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <div className="bg-black p-4 rounded-md border border-gray-800 min-h-32">
        <p>{post}</p>
      </div>
    </div>
  );
}

export default GeneratedPost;
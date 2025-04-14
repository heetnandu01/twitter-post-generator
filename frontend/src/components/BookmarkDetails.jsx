import React, { useState } from 'react';

function BookmarkDetails({ bookmark, onClose, onDelete }) {
  const [copyStatus, setCopyStatus] = useState('Copy Tweet');

  const handleCopy = () => {
    navigator.clipboard.writeText(bookmark.generatedTweet);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy Tweet'), 2000);
  };

  return (
    <div className="bookmark-modal-overlay" onClick={onClose} style={{ zIndex: 50 }}>
      <div className="bookmark-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bookmark-details-header">
          <h2>{bookmark.topic || 'Untitled Post'}</h2>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close bookmark details"
          >
            ×
          </button>
        </div>
        
        <div className="bookmark-details-content">
          <div className="bookmark-info-group">
            <label>Topic:</label>
            <div>{bookmark.topic || 'Not specified'}</div>
          </div>
          
          <div className="bookmark-info-group">
            <label>Tone:</label>
            <div>{bookmark.tone || 'Not specified'}</div>
          </div>
          
          <div className="bookmark-info-group">
            <label>Target Audience:</label>
            <div>{bookmark.targetAudience || 'Not specified'}</div>
          </div>
          
          {bookmark.prompt && (
            <div className="bookmark-info-group">
              <label>Prompt:</label>
              <div className="bookmark-prompt">{bookmark.prompt}</div>
            </div>
          )}
          
          <div className="bookmark-info-group">
            <label>Generated Tweet:</label>
            <div className="bookmark-tweet">{bookmark.generatedTweet}</div>
          </div>
          
          <div className="bookmark-details-footer">
            <button 
              className="delete-bookmark-button"
              onClick={() => onDelete(bookmark._id)}
            >
              Delete Bookmark
            </button>
            <button 
              className="copy-bookmark-button"
              onClick={handleCopy}
            >
              {copyStatus}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookmarkDetails;
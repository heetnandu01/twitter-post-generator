// components/CustomPrompt.jsx
import React from 'react';

function CustomPrompt({ customPrompt, setCustomPrompt, onGenerate }) {
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-2xl mb-6">Custom Prompt</h2>
      
      <textarea
        value={customPrompt}
        onChange={(e) => setCustomPrompt(e.target.value)}
        placeholder="Enter your custom prompt here..."
        className="w-full p-3 bg-black border border-gray-800 rounded-md min-h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={onGenerate}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
          Generate Post
        </button>
      </div>
    </div>
  );
}

export default CustomPrompt;

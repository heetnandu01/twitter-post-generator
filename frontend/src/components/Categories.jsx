// components/Categories.jsx
import React from 'react';
import Dropdown from './Dropdown';

function Categories({ topic, setTopic, tone, setTone, audience, setAudience }) {
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-2xl mb-6">Categories</h2>
      
      <div className="mb-4">
        <label className="block mb-2">Topic</label>
        <input 
          type="text" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Technology, Marketing, Personal"
          className="w-full p-3 bg-black border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Tone</label>
        <Dropdown 
          value={tone}
          onChange={setTone}
          options={['Casual', 'Professional', 'Humorous', 'Serious']}
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Target Audience</label>
        <Dropdown 
          value={audience}
          onChange={setAudience}
          options={['General', 'Professionals', 'Tech enthusiasts', 'Students']}
        />
      </div>
    </div>
  );
}

export default Categories;
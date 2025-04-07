// components/Sidebar.jsx
import React from 'react';

function Sidebar() {
  return (
    <div className="w-64 border-r border-gray-800 p-6 hidden md:block">
      <h2 className="text-xl mb-4">Bookmarks</h2>
      <p className="text-gray-400">No bookmarks yet</p>
    </div>
  );
}

export default Sidebar;
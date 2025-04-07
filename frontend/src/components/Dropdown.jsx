// components/Dropdown.jsx
import React, { useState } from 'react';

function Dropdown({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-black border border-gray-800 rounded-md flex justify-between items-center focus:outline-none"
      >
        {value}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-black border border-gray-800 rounded-md z-10">
          {options.map((option) => (
            <div 
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="p-3 hover:bg-gray-800 cursor-pointer"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
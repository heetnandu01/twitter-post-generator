import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

// Retrieve the publishable key from environment variables
const clerkPublishableKey = 'pk_test_bW9kZXJuLXN0dXJnZW9uLTYyLmNsZXJrLmFjY291bnRzLmRldiQ';
console.log('Environment Variables:', import.meta.env.clerkPublishableKey);

// Check if the key exists
if (!clerkPublishableKey) {
  console.error('Missing Clerk publishable key. Please check your environment variables.');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey || 'placeholder_key'}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
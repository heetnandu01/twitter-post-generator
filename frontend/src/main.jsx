import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import './index.css';

// Retrieve the publishable key
const clerkPublishableKey = 'pk_test_bW9kZXJuLXN0dXJnZW9uLTYyLmNsZXJrLmFjY291bnRzLmRldiQ';

// Check if the key exists
if (!clerkPublishableKey) {
  console.error('Missing Clerk publishable key. Please check your environment variables.');
}

// Authentication-aware router setup
const AuthenticatedRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
        <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
        <Route path="/" element={<App />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey || 'placeholder_key'}>
      <AuthenticatedRoutes />
    </ClerkProvider>
  </React.StrictMode>
);
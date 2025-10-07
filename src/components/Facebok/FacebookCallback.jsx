'use client'
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { redirect } from 'next/navigation';

const FacebookCallback = () => {
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Processing Facebook connection...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`Facebook login error: ${error}`);
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received from Facebook');
          return;
        }

        // Call your backend callback handler
        const response = await fetch(`https://api.seocialmedia.in/api/facebook/callback?code=${code}&state=${state}`);
        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage(`Successfully connected! Found ${data.data.totalPages} Facebook page(s)`);
          
          // Close popup and refresh parent window
          setTimeout(() => {
            if (window.opener) {
              window.opener.postMessage({ type: 'FACEBOOK_AUTH_SUCCESS', data }, '*');
              window.close();
            } else {
              // If not popup, redirect to main app
              window.location.href = '/';
            }
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Failed to connect Facebook account');
        }

      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setMessage('Connection failed. Please try again.');
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connecting Facebook</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-900 mb-2">Success!</h2>
            <p className="text-green-700">{message}</p>
            <p className="text-sm text-gray-500 mt-2">This window will close automatically...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-900 mb-2">Connection Failed</h2>
            <p className="text-red-700 mb-4">{message}</p>
            <button
              onClick={() => window.close()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Close Window
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FacebookCallback;
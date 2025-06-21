import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../contexts/AuthContext';
import '../styles/styles.css';
import '../styles/profile.css';

const Profile = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <Header />

      <main className="profile-page" style={{ background: 'transparent', padding: '2rem 0' }}>
        <div className="max-w-md mx-auto bg-white rounded-xl p-8" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: 'none', outline: 'none' }}>
          <div className="text-center">
            {/* User Icon */}
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* User Info */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{user?.name || 'User'}</h1>
            <p className="text-gray-600 text-lg mb-8">{user?.email || 'user@example.com'}</p>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg transition-all font-medium text-lg mb-6"
            >
              Log Out
            </button>

            {/* Health & Wellness Theme */}
            <div className="mb-4">
              <div className="flex justify-center space-x-8 text-gray-400">
                {/* Heart */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                {/* Shield */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {/* Chart */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <p className="text-center text-xs text-gray-500 mt-2">Your Health Journey</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
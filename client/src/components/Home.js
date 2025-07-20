import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-12 max-w-lg text-center">
        <h1 className="text-5xl font-extrabold mb-8 text-indigo-700">Bienvenue sur MonApp</h1>
        <div className="flex justify-center space-x-6">
          <Link to="/client" className="px-10 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl text-lg font-semibold transition">Client</Link>
          <Link to="/admin" className="px-10 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-lg font-semibold transition">Admin</Link>
        </div>
      </div>
    </div>
  );
}
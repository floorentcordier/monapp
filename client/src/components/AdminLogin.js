import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) navigate('/admin/dashboard'); else setError('Identifiants incorrects');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Connexion Admin</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <label className="block mb-4">
          <span className="block text-gray-700">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </label>
        <label className="block mb-6">
          <span className="block text-gray-700">Mot de passe</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </label>
        <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold transition">Se connecter</button>
      </form>
    </div>
  );
}

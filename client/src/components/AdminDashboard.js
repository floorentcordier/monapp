import React, { useEffect, useState } from 'react';
import CreateEventForm from './CreateEventForm';

export default function AdminDashboard() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/clients')
      .then((res) => res.json())
      .then(setClients);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-6 text-indigo-600 text-center">Tableau de bord Admin</h1>
      <div className="overflow-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-lg rounded-lg">
          <thead className="bg-indigo-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clients.map((c) => (
              <tr key={c.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 text-sm">{c.id}</td>
                <td className="px-6 py-4 text-sm">{c.nom}</td>
                <td className="px-6 py-4 text-sm">{c.service}</td>
                <td className="px-6 py-4 text-sm">{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ajout du formulaire de création d'événement */}
      <CreateEventForm />
    </div>
  );
}

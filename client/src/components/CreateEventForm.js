import React, { useState } from 'react';

export default function CreateEventForm() {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [message, setMessage] = useState('');

  // Simule une vérification de la distance en km
  // A adapter avec ta vraie logique (ex : calcul avec l'API Google Maps)
  function checkDistance(distancekm) {
    // Exemple : return true si distance < 30 km
    return truedistancekm <=28;
  }

  // Vérifie si la date est entre mardi et vendredi
  function isValidDay(date) {
    // 2 = mardi, 3 = mercredi, 4 = jeudi, 5 = vendredi
    const day = date.getDay();
    return day >= 2 && day <= 5;
  }

  // Vérifie si heure est entre 8h et 17h
  function isValidTime(date) {
    const hour = date.getHours();
    return hour >= 8 && hour < 17;
  }

  // Vérifie s’il y a moins de 5 événements ce jour-là (à récupérer depuis backend)
  async function checkEventsLimit(date) {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const res = await fetch(`http://localhost:3001/api/events?start=${dayStart.toISOString()}&end=${dayEnd.toISOString()}`);
    const events = await res.json();

    // Filtre uniquement les événements hors devis
    const filteredEvents = events.filter(ev => ev.summary.toLowerCase() !== 'devis');

    return filteredEvents.length < 5;
  }

  // Vérifie si l’horaire chevauche un devis existant
  async function isOverlappingDevis(start, end) {
    const res = await fetch(`http://localhost:3001/api/events?start=${new Date(start).toISOString()}&end=${new Date(end).toISOString()}`);
    const events = await res.json();

    // Check si un événement "devis" chevauche
    return events.some(ev => {
      if (ev.summary.toLowerCase() !== 'devis') return false;
      const evStart = new Date(ev.startDateTime);
      const evEnd = new Date(ev.endDateTime);
      return (new Date(start) < evEnd && new Date(end) > evStart);
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    // Validations locales
    if (!isValidDay(start)) {
      setMessage('Les rendez-vous ne peuvent être pris que du mardi au vendredi.');
      return;
    }
    if (!isValidTime(start) || !isValidTime(end)) {
      setMessage('Les rendez-vous doivent être planifiés entre 8h et 17h.');
      return;
    }
    if (!checkDistance()) {
      setMessage('Le lieu est trop éloigné pour un rendez-vous.');
      return;
    }

    // Validations backend (limite 5 rendez-vous et chevauchement devis)
    const limitOk = await checkEventsLimit(start);
    if (!limitOk) {
      setMessage('Nombre maximum de rendez-vous atteint pour ce jour.');
      return;
    }

    const overlapDevis = await isOverlappingDevis(start, end);
    if (overlapDevis) {
      setMessage('Ce créneau est déjà réservé pour un devis.');
      return;
    }

    // Si tout est OK, création de l’événement
    try {
      const res = await fetch('http://localhost:3001/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary, description, startDateTime, endDateTime }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Événement créé avec succès !');
      } else {
        setMessage('Erreur lors de la création de l’événement.');
      }
    } catch (error) {
      setMessage('Erreur réseau ou serveur.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Créer un événement</h2>
      {message && <p className="mb-4 text-center">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Résumé</span>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Date et heure de début</span>
          <input
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Date et heure de fin</span>
          <input
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Créer l’événement
        </button>
      </form>
    </div>
  );
}

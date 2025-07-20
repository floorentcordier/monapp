import React, { useState } from 'react';

export default function ClientForm() {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    adresse: '',
    cp: '',
    tel: '',
    email: '',
    service: '',
    date: '',
  });
  const [error, setError] = useState('');

  const services = ['Devis', 'Entretien', 'Dépannage'];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation côté client : vérifier la date choisie
    const dateObj = new Date(form.date);
    if (isNaN(dateObj.getTime())) {
      setError('Veuillez saisir une date valide.');
      return;
    }

    const day = dateObj.getDay(); // 0=dimanche ... 6=samedi
    const hour = dateObj.getHours();

    // Mardi à vendredi = jours 2 à 5
    if (day < 2 || day > 5) {
      setError('Les rendez-vous sont possibles uniquement du mardi au vendredi.');
      return;
    }
    if (hour < 8 || hour >= 17) {
      setError('Les rendez-vous sont possibles uniquement entre 8h et 17h.');
      return;
    }

    // Vérifier que tous les champs obligatoires sont remplis
    if (
      !form.nom.trim() ||
      !form.prenom.trim() ||
      !form.adresse.trim() ||
      !form.cp.trim() ||
      !form.tel.trim() ||
      !form.email.trim() ||
      !form.service ||
      !form.date
    ) {
      setError('Merci de remplir tous les champs obligatoires.');
      return;
    }

    setError(''); // reset erreur avant envoi

    try {
      const res = await fetch('http://localhost:3001/api/create-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (res.ok) {
        alert('Rendez-vous synchronisé avec Google Agenda !');
        // reset formulaire
        setForm({
          nom: '',
          prenom: '',
          adresse: '',
          cp: '',
          tel: '',
          email: '',
          service: '',
          date: '',
        });
      } else {
        setError(result.message || 'Erreur lors de la création du rendez-vous.');
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau ou serveur.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-md max-w-md mx-auto">
      {error && <p className="mb-4 text-red-600 text-center">{error}</p>}

      <input
        type="text"
        name="nom"
        placeholder="Nom"
        value={form.nom}
        onChange={handleChange}
        required
        className="mb-4 w-full border p-2 rounded"
      />
      <input
        type="text"
        name="prenom"
        placeholder="Prénom"
        value={form.prenom}
        onChange={handleChange}
        required
        className="mb-4 w-full border p-2 rounded"
      />
      <input
        type="text"
        name="adresse"
        placeholder="Adresse"
        value={form.adresse}
        onChange={handleChange}
        required
        className="mb-4 w-full border p-2 rounded"
      />
      <input
        type="text"
        name="cp"
        placeholder="Code postal"
        value={form.cp}
        onChange={handleChange}
        required
        className="mb-4 w-full border p-2 rounded"
      />
      <input
        type="tel"
        name="tel"
        placeholder="Téléphone"
        value={form.tel}
        onChange={handleChange}
        required
        className="mb-4 w-full border p-2 rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="mb-4 w-full border p-2 rounded"
      />
      <select
        name="service"
        value={form.service}
        onChange={handleChange}
        required
        className="mb-4 w-full border p-2 rounded"
      >
        <option value="">Choisir un service</option>
        {services.map((s) => (
          <option key={s.toLowerCase()} value={s.toLowerCase()}>
            {s}
          </option>
        ))}
      </select>
      <input
        type="datetime-local"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
        className="mb-4 w-full border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded w-full hover:bg-indigo-700 transition"
      >
        Envoyer
      </button>
    </form>
  );
}

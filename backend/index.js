const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Assure-toi d'avoir installé node-fetch v2 : npm install node-fetch@2
const { createEvent } = require('./googleCalendar');
const { getCoordinates, getDistanceFromLatLonInKm } = require('./utils/geocode');

const app = express();

app.use(cors());
app.use(express.json());

const ADMIN_EMAIL = 'flofootflo@gmail.com';
const ADMIN_PASSWORD = '12Florent';

// Stockage en mémoire des rendez-vous
const clients = [];

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    res.status(200).json({ message: 'Connexion réussie' });
  } else {
    res.status(401).json({ message: 'Identifiants incorrects' });
  }
});

app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend !');
});

app.get('/clients', (req, res) => {
  res.json(clients);
});

app.post('/api/create-event', async (req, res) => {
  const { nom, prenom, adresse, cp, tel, email, service, date } = req.body;

  if (!nom || !prenom || !adresse || !cp || !tel || !email || !service || !date) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  const dateObj = new Date(date);
  const day = dateObj.getDay();
  const hour = dateObj.getHours();

  // Vérifier jour : mardi (2) à vendredi (5)
  if (day < 2 || day > 5) {
    return res.status(400).json({ message: 'Rendez-vous uniquement du mardi au vendredi.' });
  }
  // Vérifier heure : entre 8h et 17h
  if (hour < 8 || hour >= 17) {
    return res.status(400).json({ message: 'Rendez-vous uniquement entre 8h et 17h.' });
  }

  // Vérifier max 5 rendez-vous ce jour-là
  const rdvCount = clients.filter(rdv => {
    const rdvDate = new Date(rdv.date);
    return (
      rdvDate.getFullYear() === dateObj.getFullYear() &&
      rdvDate.getMonth() === dateObj.getMonth() &&
      rdvDate.getDate() === dateObj.getDate()
    );
  }).length;

  if (rdvCount >= 5) {
    return res.status(400).json({ message: 'Nombre maximal de rendez-vous atteint pour ce jour.' });
  }

  try {
    // Coordonnées du nouveau client
    const newCoords = await getCoordinates(`${adresse}, ${cp}`);

    // Clients pris ce jour-là
    const clientsDay = clients.filter(rdv => {
      const rdvDate = new Date(rdv.date);
      return (
        rdvDate.getFullYear() === dateObj.getFullYear() &&
        rdvDate.getMonth() === dateObj.getMonth() &&
        rdvDate.getDate() === dateObj.getDate()
      );
    });

    // Vérifier la distance avec chaque client pris ce jour-là
    for (const c of clientsDay) {
      const coordsExist = await getCoordinates(`${c.adresse}, ${c.cp}`);
      const distance = getDistanceFromLatLonInKm(
        newCoords.lat,
        newCoords.lon,
        coordsExist.lat,
        coordsExist.lon
      );
      if (distance < 25) {
        return res.status(400).json({
          message: `Un rendez-vous est déjà prévu à moins de 25 km (${distance.toFixed(1)} km).`
        });
      }
    }

    // Créer l'événement Google Calendar (30 minutes)
    const summary = `${service} - ${nom} ${prenom}`;
    const description = `Client : ${nom} ${prenom}, Tel: ${tel}, Email: ${email}, Adresse: ${adresse}, CP: ${cp}`;
    const startDateTime = dateObj.toISOString();
    const endDateTime = new Date(dateObj.getTime() + 30 * 60000).toISOString();

    const event = await createEvent({ summary, description, startDateTime, endDateTime });

    // Sauvegarder le RDV en mémoire
    clients.push({ nom, prenom, adresse, cp, tel, email, service, date });

    res.status(200).json({ message: 'Rendez-vous créé avec succès.', event });
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    res.status(500).json({ message: 'Erreur lors de la création du rendez-vous.' });
  }
});

app.post('/api/calendar', async (req, res) => {
  const { summary, description, startDateTime, endDateTime } = req.body;

  try {
    const event = await createEvent({ summary, description, startDateTime, endDateTime });
    res.status(200).json({ success: true, event });
  } catch (error) {
    console.error('Erreur lors de la création de l’événement Google Calendar:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la création de l’événement' });
  }
});

app.listen(3001, () => {
  console.log('Serveur backend démarré sur http://localhost:3001');
});

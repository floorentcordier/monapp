import React from 'react';
import './App.css';
import logo from './logo-perfectair.jpeg'; // Assure-toi que l’image est bien dans src/

function App() {
  return (
    <div className="App">
      <img src={logo} alt="Logo Perfectair" className="logo" />
      <h1>Bienvenue chez Perfectair</h1>
      <p>Votre spécialiste en solutions de chauffage et poêles à pellets.</p>
      <button onClick={() => alert('Contactez-nous !')}>Contactez-nous</button>
    </div>
  );
}

export default App;

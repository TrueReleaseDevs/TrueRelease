import React, { useState, useEffect } from 'react';
import Navbar from './views/Navbar';
import Hero from './views/Hero';
import Features from './views/Features';
import Footer from './views/Footer';
import TagView from './views/TagView';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check for success flag in URL from Flask redirect
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'success') {
      setLoggedIn(true);
      const name = params.get('name');
      if (name) {
        setUserName(name);
      }
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const handleLogout = () => {
    setLoggedIn(false);
    setUserName('');
    // Clear URL parameters
    window.history.replaceState({}, document.title, "/");
  };

  return (
    <div className="app">
      <Navbar loggedIn={loggedIn} userName={userName} onLogout={handleLogout} />
      <Hero />
      {loggedIn && <TagView />}
      <Features />
      <Footer />
    </div>
  );
}

export default App;

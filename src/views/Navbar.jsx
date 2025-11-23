import React, { useState, useEffect } from 'react';

const Navbar = ({ loggedIn, onLogout, userName }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <nav style={{...styles.nav, ...(scrolled ? styles.navScrolled : {})}}>
      <div className="container" style={styles.container}>
        <div style={styles.logo}>TrueRelease</div>
        <div style={styles.links}>
          <a href="#about" style={styles.link}>About Us</a>
          <a href="#contact" style={styles.link}>Contact Us</a>

          {loggedIn ? (
             <div style={styles.userProfile}>
                <span style={styles.welcomeText}>Welcome {userName}!</span>
                <button
                  onClick={onLogout}
                  style={styles.navButton}
                >
                  Sign Out
                </button>
                <button
                  onClick={() => window.location.href = 'https://truerelease.onrender.com/login?show_dialog=true'}
                  style={styles.navButton}
                >
                  Change Account
                </button>
             </div>
          ) : (
            <button
              className="btn-primary"
              style={styles.signInBtn}
              onClick={() => window.location.href = 'https://truerelease.onrender.com/login'}
            >
              Sign in with Spotify
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1000,
    transition: 'background-color 0.3s ease',
    backgroundColor: 'transparent',
  },
  navScrolled: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--spotify-white)',
    cursor: 'pointer',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  link: {
    color: 'var(--spotify-white)',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  },
  signInBtn: {
    padding: '12px 24px',
    fontSize: '0.9rem',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  welcomeText: {
    color: 'var(--spotify-white)',
    fontWeight: '700',
    fontSize: '1rem',
  },
  navButton: {
    backgroundColor: 'transparent',
    border: '1px solid var(--spotify-white)',
    color: 'var(--spotify-white)',
    padding: '8px 16px',
    borderRadius: '500px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '700',
    transition: 'all 0.2s ease',
  }
};

export default Navbar;

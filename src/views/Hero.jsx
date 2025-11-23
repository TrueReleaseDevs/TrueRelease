import React from 'react';

const Hero = () => {
  return (
    <section style={styles.hero}>
      <div className="container" style={styles.container}>
        <h1 style={styles.title}>Unlock the full potential of your music.</h1>
        <p style={styles.subtitle}>
          Seamlessly connect with Spotify to enhance your listening experience.
          Discover, update, and curate like never before.
        </p>
        <button className="btn-primary">Get Started</button>
      </div>
    </section>
  );
};

const styles = {
  hero: {
    height: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    background: 'linear-gradient(180deg, #191414 0%, #121212 100%)',
    padding: '0 20px',
  },
  container: {
    maxWidth: '800px',
  },
  title: {
    fontSize: '4rem',
    fontWeight: '900',
    marginBottom: '24px',
    lineHeight: '1.1',
    color: 'var(--spotify-white)',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'var(--spotify-light-grey)',
    marginBottom: '40px',
    lineHeight: '1.6',
  },
};

export default Hero;

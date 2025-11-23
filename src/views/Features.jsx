import React from 'react';

const featuresData = [
  {
    title: 'Seamless Sync',
    description: 'Instantly update your playlists across all devices with real-time synchronization.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7" />
        <path d="M15 7h6v6" />
      </svg>
    ),
  },
  {
    title: 'Smart Curation',
    description: 'AI-driven recommendations that actually understand your unique taste profile.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    title: 'Dark Mode Native',
    description: 'Designed from the ground up to look stunning on your OLED screens.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
];

const Features = () => {
  return (
    <section style={styles.section}>
      <div className="container">
        <h2 style={styles.heading}>Why TrueRelease?</h2>
        <div style={styles.grid}>
          {featuresData.map((feature, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.iconWrapper}>{feature.icon}</div>
              <h3 style={styles.cardTitle}>{feature.title}</h3>
              <p style={styles.cardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: '100px 0',
    backgroundColor: 'var(--spotify-dark-grey)',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '60px',
    color: 'var(--spotify-white)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
  },
  card: {
    backgroundColor: '#181818',
    padding: '40px',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease',
    cursor: 'default',
  },
  iconWrapper: {
    color: 'var(--spotify-green)',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '16px',
    color: 'var(--spotify-white)',
  },
  cardDescription: {
    color: 'var(--spotify-light-grey)',
    fontSize: '1rem',
    lineHeight: '1.6',
  },
};

export default Features;

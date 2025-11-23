import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        <div style={styles.logo}>TrueRelease</div>
        <div style={styles.links}>
          <a href="#" style={styles.link}>Legal</a>
          <a href="#" style={styles.link}>Privacy</a>
          <a href="#" style={styles.link}>Cookies</a>
          <a href="#" style={styles.link}>About Ads</a>
        </div>
        <div style={styles.copyright}>
          &copy; {new Date().getFullYear()} TrueRelease. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#000000',
    padding: '60px 0',
    marginTop: 'auto',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.2rem',
    fontWeight: '700',
    marginBottom: '30px',
    color: 'var(--spotify-white)',
  },
  links: {
    display: 'flex',
    gap: '24px',
    marginBottom: '30px',
  },
  link: {
    color: 'var(--spotify-light-grey)',
    fontSize: '0.9rem',
    transition: 'color 0.2s ease',
  },
  copyright: {
    color: '#919496',
    fontSize: '0.8rem',
  },
};

export default Footer;

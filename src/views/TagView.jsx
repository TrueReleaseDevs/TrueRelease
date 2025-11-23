import React, { useState, useEffect } from 'react';
import TagController from '../controllers/TagController';

const TagView = () => {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Initial load
    setTags(TagController.getTags());

    // Subscribe to changes
    const unsubscribe = TagController.subscribe((newTags) => {
      console.log('Tags updated:', newTags);
      setTags([...newTags]);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting tag:', inputValue);
    TagController.addTag(inputValue);
    setInputValue('');
  };

  const [excludeCovers, setExcludeCovers] = useState(false);
  const [excludeRemixes, setExcludeRemixes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDirectAdd = () => {
    console.log('Direct add tag:', inputValue);
    TagController.addTag(inputValue);
    setInputValue('');
  };

  const handleRunScript = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://truerelease.onrender.com/run_update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exclude_covers: excludeCovers,
          exclude_remixes: excludeRemixes,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Success: ' + data.message);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error running script:', error);
      alert('Failed to run script');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section style={styles.section}>
      <div className="container">
        <h2 style={styles.heading}>Your Tags</h2>

        <div style={styles.inputContainer}>
          <div style={styles.form}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a tag..."
              style={styles.input}
            />
            <button onClick={handleDirectAdd} className="btn-primary" style={styles.button}>Add Tag</button>
          </div>
        </div>

        <div style={styles.controlsContainer}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={excludeCovers}
              onChange={(e) => setExcludeCovers(e.target.checked)}
              style={styles.checkbox}
            />
            Exclude Covers
          </label>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={excludeRemixes}
              onChange={(e) => setExcludeRemixes(e.target.checked)}
              style={styles.checkbox}
            />
            Exclude Remixes
          </label>
          <button
            onClick={handleRunScript}
            className="btn-primary"
            style={{...styles.button, ...styles.runButton}}
            disabled={isLoading}
          >
            {isLoading ? 'Running...' : 'Run Script'}
          </button>
        </div>

        <div style={styles.grid}>
          {tags.map((tag, index) => (
            <div key={index} style={styles.cube}>
              <span style={styles.tagText}>{tag.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: '60px 0',
    backgroundColor: '#121212',
    borderTop: '1px solid #282828',
  },
  heading: {
    color: 'var(--spotify-white)',
    marginBottom: '30px',
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  form: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    padding: '12px 20px',
    borderRadius: '500px',
    border: 'none',
    backgroundColor: '#282828',
    color: 'var(--spotify-white)',
    fontSize: '1rem',
    outline: 'none',
    width: '300px',
  },
  button: {
    padding: '12px 24px',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  cube: {
    width: '100px',
    height: '100px',
    backgroundColor: '#282828',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    animation: 'fadeIn 0.3s ease',
  },
  tagText: {
    color: 'var(--spotify-green)',
    fontWeight: 'bold',
    textAlign: 'center',
    wordBreak: 'break-word',
    padding: '5px',
  },
  controlsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '40px',
    flexWrap: 'wrap',
  },
  checkboxLabel: {
    color: 'var(--spotify-white)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: 'var(--spotify-green)',
    cursor: 'pointer',
  },
  runButton: {
    backgroundColor: 'var(--spotify-green)',
    color: 'black',
    fontWeight: 'bold',
    marginLeft: '10px',
  }
};

export default TagView;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiSun, FiMoon } from 'react-icons/fi';
import './App.css';

// Months mapping with special characters for Oct, Nov, Dec
const MONTHS: { [key: string]: string } = {
  '1': 'January', '2': 'February', '3': 'March', '4': 'April',
  '5': 'May', '6': 'June', '7': 'July', '8': 'August',
  '9': 'September', 'O': 'October', 'N': 'November', 'D': 'December'
};



interface DecodeResult {
  year: string;
  month: string;
  notes: string[];
}

function App() {
  const [serialNumber, setSerialNumber] = useState('');
  const [hasWaterResist, setHasWaterResist] = useState<boolean | null>(null);
  const [hasBoxedMark, setHasBoxedMark] = useState<boolean | null>(null);
  const [results, setResults] = useState<DecodeResult[]>([]);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Set up dark mode detection on component mount
  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up event listener
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const decodeSerialNumber = () => {
    // Reset states
    setError('');
    setResults([]);

    // Validate input
    if (!serialNumber) {
      setError('Please enter a serial number');
      return;
    }

    // Check if serial number is 6 or 7 digits and contains valid characters
    const isValid = /^[0-9][0-9OND][0-9]{4,5}$/i.test(serialNumber);
    if (!isValid) {
      setError('Please enter a valid 6 or 7 digit serial number. The second character must be a digit (1-9) or letter (O, N, D)');
      return;
    }

    // Get the first digit (year) and second character (month)
    const yearDigit = parseInt(serialNumber[0]);
    const monthChar = serialNumber[1].toUpperCase();
    const serialLength = serialNumber.length;

    // Get the month name
    const month = MONTHS[monthChar];
    if (!month) {
      setError('Invalid month character in serial number');
      return;
    }

    // Generate possible years based on the first digit of the serial number
    let possibleDates: DecodeResult[] = [];
    
    // For 6-digit serials (post-1968), we'll check the last 2 digits of the year
    // For 7-digit serials (pre-1968), we'll check the last digit
    const currentYear = new Date().getFullYear();
    const currentDecade = Math.floor(currentYear / 10) * 10;
    
    // Start from 1960s to current decade + 10 years
    for (let decade = 1960; decade <= currentDecade + 10; decade += 10) {
      const year = decade + yearDigit;
      
      // Skip if year is in the future or before 1960
      if (year > currentYear + 1 || year < 1960) continue;
      
      // For 6-digit serials (post-1968)
      if (serialLength === 6) {
        if (year < 1968) continue; // Skip years before 1968 for 6-digit serials
        
        const notes: string[] = [];
        notes.push('6-digit serial number suggests 1968 or later production');
        
        // Check water resist marking
        if (hasWaterResist === true && year < 1968) continue;
        if (hasWaterResist === false && year > 1971) continue;
        
        if (hasWaterResist === true) {
          notes.push('"Water Resist" marking suggests 1968-1971 production');
        } else if (hasWaterResist === false && year > 1971) {
          notes.push('"Waterproof" marking suggests pre-1968 production');
        }
        
        // Check case construction mark
        if (hasBoxedMark === true && year < 1976) continue;
        if (hasBoxedMark === true) {
          notes.push('Boxed case construction mark suggests 1976 or later production');
        }
        
        possibleDates.push({
          year: year.toString(),
          month,
          notes
        });
      }
      // For 7-digit serials (pre-1968)
      else if (serialLength === 7) {
        if (year >= 1968) continue; // Skip 1968 and later for 7-digit serials
        
        const notes: string[] = [];
        notes.push('7-digit serial number suggests pre-1968 production');
        
        // Check water resist marking
        if (hasWaterResist === true) continue; // "Water Resist" wasn't used before 1968
        if (hasWaterResist === false) {
          notes.push('"Waterproof" marking suggests pre-1968 production');
        }
        
        // Boxed marks weren't used before 1976, so this would be an error case
        if (hasBoxedMark === true) continue;
        
        possibleDates.push({
          year: year.toString(),
          month,
          notes
        });
      }
    }
      
    // Sort by year (ascending)
    possibleDates.sort((a: DecodeResult, b: DecodeResult) => parseInt(a.year) - parseInt(b.year));
    
    if (possibleDates.length === 0) {
      setError('No matching dates found based on the provided information. Try adjusting the filters or leave the advanced options blank.');
      return;
    }

    setResults(possibleDates);
  };

  // Generate snowflakes with different sizes, speeds, and positions
  const snowflakes = [];
  const snowflakeCount = 100; // Number of snowflakes
  
  for (let i = 0; i < snowflakeCount; i++) {
    const size = Math.random() * 4 + 2; // Between 2px and 6px
    const duration = Math.random() * 15 + 15; // Between 15s and 30s
    const delay = Math.random() * -20; // Start at different times
    const xEnd = (Math.random() - 0.5) * 2; // Between -1 and 1 for horizontal movement
    const startX = Math.random() * 100; // Random horizontal position
    const startY = Math.random() * -20; // Start above the viewport
    const opacity = Math.random() * 0.5 + 0.5; // Between 0.5 and 1
    
    // Create a more natural distribution of sizes
    const sizeClass = size < 3 ? 'small' : size < 5 ? 'medium' : 'large';
    
    snowflakes.push(
      <div 
        key={i} 
        className={`snowflake ${sizeClass}`}
        style={{
          '--x-end': xEnd,
          left: `${startX}%`,
          top: `${startY}vh`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          opacity: opacity,
          '--blur': `${Math.random() * 1.5 + 0.5}px`,
          '--shadow': `0 0 ${Math.random() * 8 + 4}px rgba(255, 255, 255, ${opacity})`,
        } as React.CSSProperties}
      />
    );
  }

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <div className="snow-container">
        {snowflakes}
      </div>
      <div className="app-header">
        <div className="header-buttons">
          <a 
            href="https://github.com/masaharumori7/seiko-serial-decoder" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-button"
            aria-label="View on GitHub"
            title="View on GitHub"
          >
            <FiGithub className="button-icon" />
            <span className="button-text">GitHub</span>
          </a>
          <button 
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <>
                <FiSun className="button-icon" />
                <span className="button-text">Light</span>
              </>
            ) : (
              <>
                <FiMoon className="button-icon" />
                <span className="button-text">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="content">
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Seiko Serial Number Decoder</h1>
          
          <div className="input-group">
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value.replace(/[^0-9ondOND]/g, ''))}
              placeholder="Enter 6-7 digit serial number"
              maxLength={7}
              className="serial-input"
            />
            <button onClick={decodeSerialNumber}>
              Decode
            </button>
          </div>
          
          <button 
            className="toggle-advanced" 
            onClick={() => setShowAdvanced(!showAdvanced)}
            type="button"
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced Options'}
          </button>
          
          {showAdvanced && (
            <div className="advanced-options">
              <div className="form-group">
                <p>Case back has "Water Resist" marking?</p>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="waterResist"
                      checked={hasWaterResist === true}
                      onChange={() => setHasWaterResist(true)}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="waterResist"
                      checked={hasWaterResist === false}
                      onChange={() => setHasWaterResist(false)}
                    />
                    No
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="waterResist"
                      checked={hasWaterResist === null}
                      onChange={() => setHasWaterResist(null)}
                    />
                    Not Sure
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <p>Case back has a boxed mark (like [X] or [XX])?</p>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="boxedMark"
                      checked={hasBoxedMark === true}
                      onChange={() => setHasBoxedMark(true)}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="boxedMark"
                      checked={hasBoxedMark === false}
                      onChange={() => setHasBoxedMark(false)}
                    />
                    No
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="boxedMark"
                      checked={hasBoxedMark === null}
                      onChange={() => setHasBoxedMark(null)}
                    />
                    Not Sure
                  </label>
                </div>
              </div>
            </div>
          )}

          {error && <div className="error">{error}</div>}

          {results.length > 0 && (
            <div className="results">
              <h3>Possible Manufacturing Dates:</h3>
              <ul>
                {results.map((result, index) => (
                  <li key={index}>
                    <div className="result-date">
                      {result.month} {result.year}
                    </div>
                    {result.notes.length > 0 && (
                      <div className="result-notes">
                        {result.notes.map((note, noteIndex) => (
                          <div key={noteIndex} className="note">• {note}</div>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rules">
            <h3>Decoding Rules:</h3>
            <ul>
              <li>First digit: Last digit of the year</li>
              <li>Second character: Month (1-9 = Jan-Sep, O=Oct, N=Nov, D=Dec)</li>
              <li>6 or 7 digits: 7 digits before 1968, 6 digits after</li>
              <li>"Waterproof" changed to "Water Resist" between 1968-1971</li>
              <li>Case construction mark in a box indicates 1976 or later</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;

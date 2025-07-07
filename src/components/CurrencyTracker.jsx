import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FIXER_API_KEY = process.env.REACT_APP_FIXER_API_KEY;


const CurrencyTracker = () => {
  const [currencies, setCurrencies] = useState({});
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [rate, setRate] = useState(null);

  useEffect(() => {
    // Fetch currency symbols once
    axios.get(`https://api.apilayer.com/fixer/symbols`, {
      headers: { apikey: FIXER_API_KEY }
    })
    .then(res => setCurrencies(res.data.symbols))
    .catch(err => console.error('Error fetching symbols:', err));
  }, []);

  const fetchRate = () => {
    axios.get(`https://api.apilayer.com/fixer/latest?base=${from}&symbols=${to}`, {
      headers: { apikey: FIXER_API_KEY }
    })
    .then(res => {
      setRate(res.data.rates[to]);
    })
    .catch(err => console.error('Error fetching exchange rate:', err));
  };

  return (
    <div style={styles.container}>
      <h2>💱 Currency Tracker</h2>

      <div style={styles.row}>
        <select value={from} onChange={(e) => setFrom(e.target.value)} style={styles.select}>
          {Object.keys(currencies).map(code => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>

        <span>to</span>

        <select value={to} onChange={(e) => setTo(e.target.value)} style={styles.select}>
          {Object.keys(currencies).map(code => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
      </div>

      <button onClick={fetchRate} style={styles.button}>Convert</button>

      {rate && (
        <p style={styles.result}>
          1 {from} = {rate.toFixed(2)} {to}
        </p>
      )}
    </div>
  );
};

const styles = {
  container: { textAlign: 'center', padding: '2rem' },
  row: { display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1rem 0' },
  select: { padding: '0.5rem', fontSize: '1rem' },
  button: { padding: '0.6rem 1.2rem', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' },
  result: { fontSize: '1.2rem', fontWeight: 'bold', marginTop: '1rem' }
};

export default CurrencyTracker;

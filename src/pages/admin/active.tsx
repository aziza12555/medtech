import React, { useState } from 'react';

function Example() {
  // active holatiga 'home', 'about' yoki 'contact' yoziladi
  const [active, setActive] = useState('home');

  return (
    <div>
      <nav>
        <button
          onClick={() => setActive('home')}
          style={{
            backgroundColor: active === 'home' ? 'blue' : 'gray',
            color: 'white',
            marginRight: '10px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Home
        </button>

        <button
          onClick={() => setActive('about')}
          style={{
            backgroundColor: active === 'about' ? 'blue' : 'gray',
            color: 'white',
            marginRight: '10px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          About
        </button>

        <button
          onClick={() => setActive('contact')}
          style={{
            backgroundColor: active === 'contact' ? 'blue' : 'gray',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Contact
        </button>
      </nav>

      <div style={{ marginTop: '20px' }}>
        {active === 'home' && <p>Welcome to the Home page!</p>}
        {active === 'about' && <p>Learn more About us here.</p>}
        {active === 'contact' && <p>Contact us at contact@example.com.</p>}
      </div>
    </div>
  );
}

export default Example;

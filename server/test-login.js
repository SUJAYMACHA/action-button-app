const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      }),
    });

    const data = await response.json();
    console.log('Login response:', data);
    return data;
  } catch (error) {
    console.error('Error during login:', error);
  }
}

// Run the test
testLogin(); 
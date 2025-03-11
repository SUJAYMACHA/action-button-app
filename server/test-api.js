const fetch = require('node-fetch');

// Test user registration
async function registerUser() {
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
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
    console.log('Registration response:', data);
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
  }
}

// Run the test
registerUser(); 
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
    sslmode: 'require'
  } : false,
  // Add connection timeout
  connectionTimeoutMillis: 5000,
  // Add idle timeout
  idleTimeoutMillis: 30000,
  // Add max connection retries
  max: 20,
  min: 4
});

// Add error handler for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Test database connection on startup
(async () => {
  try {
    console.log('Attempting to connect to database...');
    console.log('Connection string (redacted):', 
      process.env.DATABASE_URL?.replace(/:[^:]*@/, ':***@'));
    
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL');
    
    // Check if users table exists, create it if not
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Users table does not exist, creating it...');
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        
        -- Add index on email for faster lookups
        CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
      `);
      console.log('Users table created successfully');
    } else {
      console.log('Users table already exists');
      // Check for plain text passwords and hash them
      const users = await client.query('SELECT id, email, password FROM users');
      for (const user of users.rows) {
        // Check if password is not hashed (doesn't start with $2b$)
        if (!user.password.startsWith('$2b$')) {
          console.log(`Hashing plain text password for user: ${user.email}`);
          const hashedPassword = await bcrypt.hash(user.password, 10);
          await client.query(
            'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
            [hashedPassword, user.id]
          );
        }
      }
      // Log number of users
      const userCount = await client.query('SELECT COUNT(*) FROM users');
      console.log(`Current number of users in database: ${userCount.rows[0].count}`);
    }
    
    client.release();
  } catch (error) {
    console.error('Database connection error:', error);
    if (error.code === '28P01') {
      console.error('Authentication failed. Please check your database credentials.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('Connection timed out. Please check if the database is accessible.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Please check if the database server is running.');
    }
    console.error('Full error details:', JSON.stringify(error, null, 2));
  }
})();

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    console.log('Testing database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('Database test successful:', result.rows[0]);
    res.json({ success: true, time: result.rows[0].now });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// User routes
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register request received:', { ...req.body, password: '[HIDDEN]' });
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Registration failed: Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Registration failed: Invalid email format');
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 8) {
      console.log('Registration failed: Password too short');
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (email, password, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id, email',
      [email, hashedPassword]
    );
    
    console.log('User registered successfully:', result.rows[0]);
    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request received:', { ...req.body, password: '[HIDDEN]' });
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('Login query result:', result.rows.length > 0 ? 'User found' : 'User not found');
    
    if (result.rows.length === 0) {
      console.log('Login failed: User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    console.log('Found user:', { id: user.id, email: user.email, hashedPassword: user.password.substring(0, 10) + '...' });
    
    // Compare hashed password
    console.log('Comparing passwords...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('User logged in successfully:', { id: user.id, email: user.email });
    res.json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a test user and update passwords on server start
(async () => {
  try {
    console.log('Initializing users...');
    
    // Update joy@gmail.com password
    const joyPassword = '12345678';
    const joyHashedPassword = await bcrypt.hash(joyPassword, 10);
    await pool.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE email = $2',
      [joyHashedPassword, 'joy@gmail.com']
    );
    console.log('Updated password for joy@gmail.com');

    // Update or create test@example.com user
    const testPassword = 'password123';
    const testHashedPassword = await bcrypt.hash(testPassword, 10);
    await pool.query(`
      INSERT INTO users (email, password, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      ON CONFLICT (email) 
      DO UPDATE SET password = $2, updated_at = NOW()
      RETURNING id, email
    `, ['test@example.com', testHashedPassword]);
    console.log('Updated/created test@example.com user');

    // Log current users
    const users = await pool.query('SELECT id, email FROM users');
    console.log('Current users:', users.rows);
  } catch (error) {
    console.error('Error updating users:', error);
  }
})();

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server is listening on all network interfaces`);
  // Log all listening addresses
  const addresses = server.address();
  console.log('Server addresses:', addresses);
}); 
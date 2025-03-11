# Action Button App

A modern web application with authentication built using React, Vite, and PostgreSQL.

## Features
- Modern UI with neon glow effects
- User authentication (login/register)
- Secure password handling
- PostgreSQL database integration (pre-configured and ready to use)

## Tech Stack
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL (hosted on Railway)
- Styling: Tailwind CSS + shadcn/ui

## Getting Started

### Prerequisites
- Node.js (v16 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/action-button-app.git
cd action-button-app
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. Start the development servers:
```bash
# From the root directory
npm run dev:full
```

The application will be available at:
- Frontend: http://localhost:8080
- Backend: http://localhost:3001

> **Note**: The database is already configured and hosted on Railway. You don't need to set up your own database - everything is ready to use!

## Test Users
You can use these pre-configured test accounts to try the application:
1. Email: test@example.com / Password: password123
2. Email: joy@gmail.com / Password: 12345678

## Development

### Available Scripts
- `npm run dev` - Start the frontend development server
- `npm run server` - Start the backend server
- `npm run dev:full` - Start both frontend and backend servers
- `npm run build` - Build the frontend for production

## Security Notes
- Make sure to change the database credentials in production
- Never commit the `.env` file
- Update the test users' passwords in production
- Consider implementing rate limiting and other security measures for production use

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details

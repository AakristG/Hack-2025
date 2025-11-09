# Customer Satisfaction Analysis

A simple web application for analyzing customer satisfaction with products. Features user authentication, data visualization, and CRUD operations for satisfaction data.

## Features

- 🔐 User authentication (login/register)
- 📊 Interactive charts and statistics
- 📝 Add, view, and delete satisfaction entries
- 📈 Rating distribution visualization
- 🎯 Product-wise analysis
- 📱 Responsive design

## Tech Stack

### Backend
- Node.js & Express
- SQLite database
- JWT authentication
- bcrypt for password hashing

### Frontend
- React
- React Router
- Axios for API calls
- Recharts for data visualization

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install backend dependencies:**
   ```bash
   npm install
   ```

2. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

   Or install all at once:
   ```bash
   npm run install-all
   ```

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend
   npm run client
   ```

4. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`
   - You'll be redirected to the login page

## Default Credentials

- **Username:** `admin`
- **Password:** `admin123`

## Project Structure

```
Hack-2025/
├── server/
│   ├── index.js              # Express server setup
│   ├── database/
│   │   └── init.js           # Database initialization
│   └── routes/
│       ├── auth.js           # Authentication routes
│       └── satisfaction.js  # Satisfaction data routes
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── context/          # Auth context
│   │   └── App.js
│   └── package.json
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Satisfaction Data
- `GET /api/satisfaction` - Get all satisfaction entries
- `GET /api/satisfaction/stats` - Get statistics
- `POST /api/satisfaction` - Add new entry
- `DELETE /api/satisfaction/:id` - Delete entry

## Database

The application uses SQLite for simplicity. The database file (`database.sqlite`) will be created automatically in the `server/database/` directory on first run.

### Tables
- `users` - User accounts
- `satisfaction_data` - Customer satisfaction entries

## Environment Variables

Create a `.env` file in the root directory (optional):

```
PORT=5001
JWT_SECRET=your-secret-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-1.5-flash
```

**Required:**
- `GEMINI_API_KEY` - Your Google Gemini API key (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

**Optional:**
- `PORT` - Server port (default: 5001)
- `JWT_SECRET` - Secret key for JWT tokens (default: 'your-secret-key-change-in-production')
- `GEMINI_MODEL` - Gemini model to use (default: 'gemini-1.5-flash'). Options: 'gemini-1.5-flash' (faster, cheaper) or 'gemini-1.5-pro' (more capable)

## License

ISC


# Habitly — MERN Full-Stack Habit Tracker

Habitly is a full-stack habit-tracking web application built with the MERN stack. It allows authenticated users to create habits, track daily completion, monitor streaks, and review their progress through dashboards, calendars, and statistics.

This repository contains the complete frontend and backend implementation of Habitly.

## Features

### Authentication & User Management

- User registration and login
- JWT-based authentication
- Protected routes
- User-specific data
- Password hashing with bcrypt
- Remember-me behavior using `localStorage` / `sessionStorage`
- Update user information
- Update password
- Account deletion with related data cleanup

### Habit Management

- Create habits
- Update habit names
- Delete habits
- Assign colors to habits
- Daily completion tracking
- Add and remove completion dates
- Habit streak calculation
- Search habits
- Filter habits by streak
- Sort habits by streak/progress

### Dashboard & Tracking

- Habit dashboard
- Weekly/current-day tracking
- Monthly calendar activity
- Streak information
- Statistics and progress tracking
- Responsive desktop and mobile UI
- Mobile navigation
- Dark mode support

### AI Assistant

Habitly includes a Gemini-powered AI assistant connected through a separate Project Assistant backend.

- Habitly-specific project context
- Gemini-powered question answering
- Markdown and GitHub-Flavored Markdown responses
- Loading state while generating responses
- Cancel active AI requests
- Axios API communication
- Backend/API error handling
- Retry handling for temporary Gemini service failures
- Offline connectivity handling

The current assistant is focused on answering questions about Habitly. AI-powered application actions such as creating, updating, completing, or deleting habits are planned for a future stage using tool/function calling.

### Offline Handling

- Global offline notification when the browser loses connectivity
- Back-online notification when connectivity is restored
- AI assistant provides a contextual offline message when an AI request cannot be sent

## Tech Stack

### Frontend

- React.js
- React Router
- Tailwind CSS
- JavaScript (ES6+)
- Vite
- Axios
- Lucide React
- React Markdown
- Remark GFM
- localStorage / sessionStorage

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- CORS
- dotenv

### AI Integration

- Google Gemini API
- `@google/genai`
- Project-specific documentation/context
- Retry handling for temporary AI service failures

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- AI Project Assistant backend: Render

## Application Architecture

```text
React Frontend
      ↓
Axios API Requests
      ↓
Express / Node.js Backend
      ↓
JWT Authentication
      ↓
Controllers / Routes
      ↓
Mongoose
      ↓
MongoDB Atlas
```

### AI Assistant Flow

```text
Habitly Frontend
      ↓
Project Assistant API
      ↓
Project Context Service
      ↓
Habitly Project Documentation
      ↓
Google Gemini
      ↓
Markdown Response
      ↓
Habitly AI Assistant UI
```

## Repository Structure

```text
habitly-mern-project/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   └── routes/
│   └── package.json
│
└── README.md
```

## What I Practiced

This project has been used to practice practical full-stack development, including:

- React component development
- React Router and protected routes
- Forms and validation
- Axios-based API communication
- Node.js and Express.js backend development
- MongoDB and Mongoose CRUD operations
- JWT authentication
- bcrypt password hashing
- User-specific data handling
- Error handling
- Responsive UI development
- Git and GitHub workflow
- Frontend and backend deployment
- Gemini API integration
- Project-specific AI context
- Markdown AI response rendering
- Request cancellation
- Offline connectivity handling

## Getting Started

### Clone the repository

```bash
git clone https://github.com/manoj2161/habitly-mern-project.git
cd habitly-mern-project
```

### Backend

```bash
cd backend
npm install
```

Configure the required environment variables in a `.env` file, including the MongoDB connection string, JWT secret, and AI API key where applicable.

Start the backend using the project's configured Node.js command.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will display the local frontend URL in the terminal.

## Current AI Roadmap

The current AI assistant provides project-aware answers about Habitly.

Planned improvements:

- Conversation history
- Persistent user memory
- AI tool/function calling for Habitly actions
- More advanced project retrieval / RAG
- Streaming AI responses

## Author

**Manoj Kumar**

- GitHub: https://github.com/manoj2161
- Portfolio: https://manoj-portfolio-21.vercel.app/
- LinkedIn: https://www.linkedin.com/in/manoj-kumar-811245200

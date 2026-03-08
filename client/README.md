# EatWisely - Restaurant Listing App

A React-based restaurant listing application with ingredient transparency features.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Flowbite React
- **State Management**: Redux Toolkit + Redux Persist
- **Routing**: React Router DOM
- **Authentication**: Firebase Auth + Google OAuth
- **Database**: Firebase Firestore

## Getting Started

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and add your Firebase configuration:

```bash
cp .env.example .env
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Buildbash
npm run build
```

## for Production

``` Project Structure

```
client/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Route pages
│   ├── redux/         # Redux store and slices
│   ├── App.jsx       # Main app component
│   ├── main.jsx      # Entry point
│   └── firebase.js   # Firebase configuration
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Features

- User authentication (email/password + Google OAuth)
- Restaurant listings with ingredient information
- User profile management
- Dashboard for restaurant owners
- Redux-based state management with persistence

## License

MIT

# Property Management System

Modern property management application built with React, TypeScript, and Express.js.

## Features

- 🏢 Building and apartment management
- 👥 Resident management system
- 💰 Fee payment tracking
- 🔧 Maintenance request system
- 📝 Contact form management
- 📊 Admin dashboard with analytics
- 🔐 Secure authentication system

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS + shadcn/ui components
- TanStack Query for data fetching
- Wouter for routing
- React Hook Form + Zod validation

### Backend
- Express.js with TypeScript
- PostgreSQL with Drizzle ORM
- Session-based authentication
- RESTful API design

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` file with your database URL and other configurations.

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking
- `npm run db:push` - Push database schema changes

## Environment Variables

Check `.env.example` for required environment variables.

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on every push

### Manual Deployment

1. Build the project: `npm run build`
2. Upload `dist` folder to your server
3. Set up environment variables
4. Start with: `npm start`

## License

MIT
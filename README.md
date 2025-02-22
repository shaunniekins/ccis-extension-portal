# CCIS Extension Portal

## Overview

The CCIS Extension Portal is a comprehensive web-based platform designed to facilitate and streamline the management of partner collaborations, projects, and trainings within the CCIS (Center for Community and Institutional Services). The system serves as a centralized hub for tracking, organizing, and archiving essential documents, ensuring transparency, accessibility, and efficiency in all partnership and project activities.

### Purpose

This portal aims to enhance collaboration and documentation management across CCIS's partnership projects and trainings.

## Tech Stack

- **Frontend**: Next.js, TailwindCSS, React
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL<!-- - **Authentication**: Supabase Auth -->
- **Storage**: Supabase Storage
- **Deployment**: Vercel
- **Container**: Docker
- **ORM**: Prisma

## Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/shaunniekins/ccis-extension-portal.git
cd ccis-extension-portal
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file at the root of your project with the following variables:

```env
# Database Configuration for Prisma
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Database Configuration for Docker PostgreSQL
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=your_database_name

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
```

## Getting Started

1. Start the database:

```bash
# Stop any existing containers
docker-compose down

# Start containers in detached mode
docker-compose up -d

# Verify containers are running
docker ps
```

2. Initialize the database schema:

```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3060](http://localhost:3060) in your browser

## Deployment

The application is configured for deployment on Vercel:

1. Push your changes to the main branch
2. Vercel will automatically build and deploy

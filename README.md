# CCIS Extension Portal

## Overview

The CCIS Extension Portal is a comprehensive web-based platform designed to facilitate and streamline the management of partner collaborations, projects, and trainings within the CCIS (Center for Community and Institutional Services). The system serves as a centralized hub for tracking, organizing, and archiving essential documents.

## Tech Stack

- **Frontend**: Next.js, TailwindCSS, React
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase (AWS S3-protocol)
- **Deployment**: Vercel
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
# Database Configuration for Supabase
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations.
DIRECT_URL="postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

# Supabase S3-Compatible Storage
NEXT_PUBLIC_SUPABASE_S3_REGION=your_supabase_s3_region
NEXT_PUBLIC_SUPABASE_S3_ENDPOINT=your_supabase_s3_endpoint
SUPABASE_S3_ACCESS_KEY=your_supabase_s3_access_key
SUPABASE_S3_SECRET_KEY=your_supabase_s3_secret_key

# Others
NEXTAUTH_SECRET=your_generated_secret
ALLOWED_DOMAINS=comma,separated,domains
```

## Development Setup

1. Set up Supabase:

   - Create a new project in Supabase
   - Get your database environment variables from Connect > ORMs
   - Update your `.env` file with the environment variables
   - Enable and configure Supabase Storage to use S3-compatible mode

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

## Generating NEXTAUTH_SECRET

Choose one of these methods:

1. Using OpenSSL:

```bash
openssl rand -base64 32
```

2. Using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

# QR-Based Digital Menu Management System

A modern, QR-based digital menu platform for restaurants built with Next.js 15, MySQL, Prisma ORM, and Auth.js.

## Features

- **QR Code Generation**: Generate unique QR codes for each restaurant and table
- **Digital Menu Management**: Create and manage menu categories and items
- **Public Menu Viewing**: Customers can view menus by scanning QR codes
- **Role-Based Access**: Admin and Restaurant Owner roles
- **Responsive Design**: Mobile-optimized menu viewing
- **Search Functionality**: Customers can search menu items
- **Image Upload**: Cloudinary integration for image storage

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js Route Handlers (API Routes)
- **Database**: MySQL
- **ORM**: Prisma ORM
- **Authentication**: Auth.js (NextAuth)
- **Image Storage**: Cloudinary
- **QR Generation**: qrcode npm package
- **Deployment**: Vercel-ready

## Project Structure

```
digital-menu/
├── app/
│   ├── api/                 # API Routes
│   │   ├── auth/           # NextAuth configuration
│   │   ├── admin/          # Admin-only APIs
│   │   ├── categories/     # Category CRUD
│   │   ├── menu-items/     # Menu item CRUD
│   │   ├── public/         # Public menu APIs
│   │   ├── qr-codes/       # QR code generation
│   │   └── restaurants/    # Restaurant CRUD
│   ├── admin/              # Admin dashboard pages
│   ├── dashboard/          # Owner dashboard pages
│   ├── login/              # Login page
│   ├── menu/               # Public menu pages
│   └── page.tsx            # Home page
├── lib/                    # Utilities
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # Auth utilities
│   ├── cloudinary.ts      # Cloudinary config
│   └── utils.ts           # Helper functions
├── prisma/
│   └── schema.prisma      # Database schema
└── types/
    └── next-auth.d.ts     # TypeScript types
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- MySQL database
- Cloudinary account (for image uploads)

### 1. Install Dependencies

```bash
cd digital-menu
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/digital_menu"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Open Prisma Studio
npm run db:studio
```

### 4. Seed Demo Data

Create the first admin user by running the seed script or manually adding users to the database:

**Admin User:**
- Email: admin@example.com
- Password: admin123
- Role: ADMIN

**Owner User:**
- Email: owner@example.com
- Password: owner123
- Role: OWNER

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### Admin Dashboard
- Navigate to `/login` and sign in as admin
- Access admin dashboard at `/admin`
- Manage all users and restaurants
- Create new restaurant owners

### Restaurant Owner
- Login as owner at `/login`
- Access dashboard at `/dashboard`
- Create restaurants
- Add categories and menu items
- Generate QR codes for tables

### Public Menu
- QR codes link to `/menu/[restaurant-slug]`
- Optional table number: `/menu/[slug]?table=1`
- Customers can search and browse the menu

## Database Schema

### Users
- id, name, email, password, role (ADMIN/OWNER)

### Restaurants
- id, name, slug, logo, address, phone, ownerId

### Categories
- id, restaurantId, name, description, sortOrder

### Menu Items
- id, categoryId, name, description, price, image, isAvailable, isPopular

### QR Codes
- id, restaurantId, code, qrImageUrl, tableNumber, scanCount

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/public/menu/[slug] | Get public menu |
| GET | /api/public/search/[slug] | Search menu items |
| GET/POST | /api/restaurants | List/Create restaurants |
| GET/PUT/DELETE | /api/restaurants/[id] | Manage restaurant |
| GET/POST | /api/categories | List/Create categories |
| PUT/DELETE | /api/categories/[id] | Update/Delete category |
| GET/POST | /api/menu-items | List/Create menu items |
| PUT/DELETE | /api/menu-items/[id] | Update/Delete item |
| GET/POST | /api/qr-codes | List/Generate QR codes |
| PUT/DELETE | /api/qr-codes/[id] | Update/Delete QR |
| GET/POST | /api/admin/users | List/Create users |

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Add MySQL database (e.g., PlanetScale, Railway)
5. Deploy

### Manual Deployment

```bash
# Build
npm run build

# Start production server
npm start
```

## License

MIT License - Devvoltz Technology PLC

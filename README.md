# Logistics Management System

A modern logistics management system built with Next.js 14, featuring real-time tracking, user authentication, and a responsive dashboard.

## Features

### 🚚 Delivery Management
- Create and manage delivery orders
- Track delivery status in real-time
- View delivery history and analytics
- Generate delivery reports

### 👥 Customer Management
- Store and manage customer information
- View customer delivery history
- Customer address management
- Customer contact details

### 🚗 Vehicle Management
- Track vehicle inventory
- Manage vehicle maintenance schedules
- Vehicle assignment for deliveries
- Vehicle status monitoring

### 👨‍💼 Driver Management
- Driver profiles and documentation
- Driver assignment system
- Track driver performance
- Driver availability status

### 📦 Product Management
- Product inventory tracking
- Product categorization
- Stock management
- Product details and specifications

### 📊 Dashboard Analytics
- Real-time delivery statistics
- Weekly/Monthly delivery reports
- Performance metrics
- Interactive charts and graphs

## Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS
- **UI Components**: Shadcn/ui
- **Authentication**: JWT
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Icons**: Lucide Icons

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.17 or later
- npm or yarn or pnpm
- Git

## Installation

1. Clone the repository:

```bash
git clone https://github.com/uluumbch/pengiriman-next-js.git
cd pengiriman-next-js
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env` file in the root directory and add your environment variables:

```env
NEXT_PUBLIC_API_URL=your_api_url
JWT_SECRET=your_jwt_secret
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Deployment

### Option 1: Vercel (Recommended)

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI:

```bash
npm install -g vercel
```

3. Login to Vercel:

```bash
vercel login
```

4. Deploy:

```bash
vercel
```

### Option 2: Traditional Hosting

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

The build output will be in the `.next` folder.

### Environment Variables for Production

Make sure to set these environment variables in your hosting platform:
- `NEXT_PUBLIC_API_URL`
- `JWT_SECRET`
- Any other environment variables your app uses

## Project Structure

```
   |-public
   |-src
   |---app
   |-----(auth) // auth route group
   |-------login
   |---------admin // admin login page
   |---------driver // driver login page
   |-----(dashboard) // dashboard route group
   |-------dashboard 
   |---------barang 
   |---------kendaraan
   |---------pelanggan
   |---------pengiriman
   |-----------[id]
   |-------------edit
   |-----------tambah
   |---------supir
   |-----(driver) // driver route group
   |-------driver
   |-------pengiriman
   |-----fonts
   |---components
   |-----icons // custom icons from lucide icons
   |-----ui // ui components crafted from shadcn/ui
   |---hooks
   |---lib
```


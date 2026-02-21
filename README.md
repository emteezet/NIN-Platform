# NIN Third-Party Style ID Slip & Card Generator

> ⚠️ **DISCLAIMER**: This platform is a school project simulation and is not affiliated with NIMC or any government agency.

## 📋 Project Overview

A modern third-party-style web platform that simulates NIN (National Identification Number) slip generation and plastic ID card preview. Users can enter a NIN or phone number to retrieve mock records, generate professional PDF slips, preview ID cards, and verify records via QR codes.

## ✨ Features

- **NIN/Phone Lookup** — Search by NIN or registered phone number
- **PDF Slip Generation** — Professional PDF with photo, personal details, QR code
- **Plastic ID Card Preview** — Interactive card with flip animation (front/back)
- **QR Code Verification** — Scan QR to verify identity details
- **Admin Panel** — Manage users, view statistics, add mock users
- **Dark Mode** — Toggle between light and dark themes
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Secure** — Input validation, sanitized responses, hashed serial numbers

## 🏗 Architecture

```
User → Next.js Frontend → API Routes → MongoDB → Generate QR + PDF → Return to User
```

### Tech Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **PDF**: PDFKit
- **QR Code**: qrcode npm package

## 📁 Folder Structure

```
/nin-platform
  /app
    /page.js                 # Landing page
    /generate/page.js        # Results page
    /verify/[nin]/page.js    # Verification page
    /admin/page.js           # Admin panel
    /api
      /generate/route.js     # POST - Generate slip
      /verify/[nin]/route.js # GET - Verify NIN
      /admin/auth/route.js   # POST - Admin login
      /admin/users/route.js  # GET/POST/DELETE - User CRUD
      /admin/stats/route.js  # GET - Dashboard stats
  /components
    InputForm.js             # Search input
    SlipPreview.js           # Slip visual preview
    CardPreview.js           # ID card preview
    Navbar.js                # Navigation bar
    Footer.js                # Disclaimer footer
    ThemeProvider.js          # Dark mode context
    ThemeToggle.js            # Theme switch button
  /lib
    /models
      User.js                # User schema
      Slip.js                # Slip tracking schema
    /utils
      generatePDF.js         # PDF generation
      generateQR.js          # QR code generation
      serial.js              # Serial number generator
    mongodb.js               # Database connection
  /scripts
    seed.js                  # Database seeder
  /public/uploads            # Photo uploads
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB (local or Atlas)

### 1. Clone and Install

```bash
cd nin-platform
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and update:

```env
MONGODB_URI=mongodb://localhost:27017/nin-platform
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ADMIN_PASSWORD=admin123
```

**For MongoDB Atlas**, replace `MONGODB_URI` with your Atlas connection string:
```
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/nin-platform
```

### 3. Seed the Database

```bash
npm run seed
```

This creates 6 sample users with Nigerian names, states, and NINs.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Production Build

```bash
npm run build
npm start
```

## 🧪 Sample Data

| Name | NIN | Phone |
|------|-----|-------|
| Adewale Okonkwo | 12345678901 | 08012345678 |
| Ngozi Adekunle | 23456789012 | 08023456789 |
| Ibrahim Mohammed | 34567890123 | 08034567890 |
| Folake Adeyemi | 45678901234 | 08045678901 |
| Emeka Nwankwo | 56789012345 | 08056789012 |
| Aisha Bello | 67890123456 | 08067890123 |

## 🔐 Admin Panel

- URL: `/admin`
- Default password: `admin123`
- Features: View all users, add mock users, delete users, view generation stats

## 🔒 Security

- NIN validated as exactly 11 digits
- Phone number validated as Nigerian format (0XXXXXXXXXX)
- Database structure not exposed in API responses
- Raw database errors never sent to client
- Serial numbers generated with Node.js crypto module

## 📄 License

MIT — For educational purposes only.

---

> *"This platform is a school project simulation and is not affiliated with NIMC or any government agency."*

# AI-Powered RFP Management System

A full-stack web application that streamlines the Request for Proposal (RFP) procurement workflow using AI. The system helps procurement managers create RFPs from natural language, manage vendors, send RFPs via email, automatically parse vendor responses, and compare proposals with AI-powered recommendations.

## Features

- **Natural Language RFP Creation**: Describe procurement needs in plain English; AI converts it to structured RFP.
- **Vendor Management**: CRUD operations for vendor database.
- **Multi-Send Email Workflow**: Send RFPs to vendors with tracking to prevent duplicates. Supports sending to additional vendors later.
- **AI-Powered Parsing**: Automatically extracts structured data (Price, Delivery, Terms) from vendor email responses using Gemini AI.
- **Smart Proposal Comparison**: Multi-factor scoring with AI recommendations:
  - **Price (40%)**: Compares against RFP budget.
  - **Delivery (25%)**: Compares against RFP deadline.
  - **Terms (20%)**: Compares against RFP payment terms.
  - **Completeness (15%)**: Checks for required fields.
- **Premium UI**: Modern, responsive interface with Tailwind CSS and glassmorphism effects.

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit with Redux Saga
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (MVC pattern)
- **Database**: PostgreSQL 
- **AI**: Google Gemini Pro (`@google/generative-ai`)
- **Email**: Nodemailer (SMTP) + IMAP
- **Validation**: Joi
- **Cron Jobs**: node-cron

## Project Structure

```
RFP/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, environment config
│   │   ├── models/          # Data access layer (raw SQL)
│   │   ├── services/        # Business logic (AI, email, RFP, vendor)
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Error handling, validation
│   │   ├── validations/     # Joi schemas
│   │   ├── utils/           # Logger, response helpers
│   │   ├── jobs/            # Email polling cron job
│   │   ├── app.js           # Express app
│   │   └── server.js        # Server entry point
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── appmodules/      # Feature modules
    │   │   ├── rfp/         # RFP creation, sending
    │   │   ├── vendor/      # Vendor management
    │   │   ├── proposal/    # Proposal comparison
    │   │   └── dashboard/   # Main dashboard
    │   ├── basemodules/     # Core infrastructure
    │   │   ├── navigation/  # Routing
    │   │   ├── network/     # Axios config
    │   │   ├── redux/       # Store setup
    │   │   └── utils/       # Formatters, constants
    │   ├── components/      # Reusable UI components
    │   ├── assets/          # Styles, images
    │   ├── App.jsx
    │   └── index.jsx
    ├── package.json
    └── tailwind.config.js
```

## Prerequisites

- **Node.js**: v18+ and npm
- **PostgreSQL**: v14+
- **Gemini API Key**: For AI features
- **Email Account**: Gmail with App Password (for SMTP/IMAP)

## Setup Instructions

### 1. Clone and Install

```bash
git clone 

cd /RFP

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```


### 2. Configure Environment Variables

Create `.env` file in `backend/` directory:



Edit `.env` with your credentials:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rfp_management
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# AI (Gemini)
GEMINI_API_KEY=your_gemini_api_key

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your-email@gmail.com
IMAP_PASS=your-app-password
IMAP_TLS=true

# Email polling interval (minutes)
EMAIL_POLL_INTERVAL=2
```

### 4. Run the Application

**Backend:**
```bash
cd backend
npm run dev
```
Server runs on http://localhost:5000

**Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:3000

## API Documentation

Base URL: `http://localhost:5000/api`

### RFP Endpoints
- `POST /rfps/create`: Create RFP from natural language
- `GET /rfps`: Get all RFPs
- `GET /rfps/:id`: Get RFP by ID
- `POST /rfps/:id/send`: Send RFP to vendors

### Vendor Endpoints
- `POST /vendors`: Create vendor
- `GET /vendors`: Get all vendors
- `PUT /vendors/:id`: Update vendor
- `DELETE /vendors/:id`: Delete vendor

### Proposal Endpoints
- `GET /proposals/rfp/:rfpId`: Get proposals for RFP
- `POST /proposals/check`: Manually check emails
- `GET /proposals/:rfpId/compare`: Compare proposals with AI scoring



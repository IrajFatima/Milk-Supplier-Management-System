# 🥛 Milk Supplier Management System (MSMS)

<p align="center">
  <strong>A web-based Milk Supplier Management System for managing farm operations, livestock, milk production, customers, orders, deliveries, and business workflows.</strong>
</p>

<p align="center">
  <!-- Technology Badges -->
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white" alt="Vercel" />
</p>

<p align="center">
  <a href="https://msms-murex.vercel.app/">Live Frontend</a> •
  <a href="https://msmsbackend.vercel.app/">Backend API</a> •
  <a href="https://github.com/IrajFatima/Milk-Supplier-Management-System">GitHub Repository</a> •
  <a href="https://app.notion.com/p/Milk-Supplier-Management-System-SRS-3980fe186722805fbe8bcb1fd86d6ea1?source=copy_link">SRS</a>
</p>

---

## 📌 Overview

The **Milk Supplier Management System (MSMS)** is a web-based business management application designed to support the operational workflow of a milk-producing and milk-supplying business.

The system provides a centralized platform for managing:

- 👥 Users and role-based access
- 🐄 Livestock and animal records
- 🥛 Daily milk production
- 🌡️ Temperature monitoring
- 👤 Customers
- 📦 Orders and subscriptions
- 🚚 Delivery planning and execution
- 📊 Role-specific dashboards
- ⚙️ System configurations
- 🔐 Authentication and authorization

MSMS is an **MVP implementation of the requirements defined in the MSMS Software Requirements Specification (SRS)**.

The SRS describes a broader system capable of supporting extensive farm inventory, livestock, milk supplier operations, customer sales, deliveries, billing, reporting, and other business workflows. The current implementation intentionally focuses on the core workflows required for the MVP rather than implementing every SRS feature in full depth.

---

## 🎯 Project Objectives

The primary objectives of MSMS are to:

1. Centralize operational data for a milk supplier/farm business.
2. Replace fragmented manual workflows with a structured web application.
3. Provide role-based access to business functionality.
4. Track livestock and milk production records.
5. Manage customers and their milk orders.
6. Plan and execute milk deliveries.
7. Provide role-specific operational dashboards.
8. Automate selected recurring processes through scheduled jobs.
9. Provide a secure REST API and structured frontend architecture.
10. Establish a scalable foundation for future SRS functionality.

---

## 🌐 Live Application

### Frontend

**MSMS Web Application**

https://msms-murex.vercel.app/

### Backend

**MSMS REST API**

https://msmsbackend.vercel.app/

### Source Code

**GitHub Repository**

https://github.com/IrajFatima/Milk-Supplier-Management-System

### Software Requirements Specification

**MSMS SRS**

https://app.notion.com/p/Milk-Supplier-Management-System-SRS-3980fe186722805fbe8bcb1fd86d6ea1?source=copy_link

---

# ✨ Implemented MVP Features

## 🔐 Authentication & Authorization

- JWT-based authentication
- Login and logout
- Protected routes
- Role-based route protection
- Role-specific navigation
- Inactivity-based logout
- Password hashing using bcrypt
- Configurable JWT expiration
- Centralized authentication context

### Supported Roles

| Role | Description |
|---|---|
| 👑 Owner | Full operational and management access |
| 🐄 Farm Worker | Farm and production-related operations |
| 🚚 Delivery Staff | Assigned delivery operations |
| 💰 Accountant | Financial/business-related dashboard access |
| ⚙️ System Administrator | System and user administration |

---

## 👥 User Management

Authorized users can manage system users and employee accounts.

Implemented functionality includes:

- User creation
- User details
- User listing
- Search and filtering
- Pagination
- User status management
- User activation/deactivation
- Role assignment
- Secure password hashing

The system applies different permissions to **Owner** and **System Administrator** accounts.

---

## 🐄 Animal Management

The animal management module supports core livestock tracking.

Implemented functionality includes:

- Animal registration
- Animal details
- Animal editing
- Animal listing
- Search
- Filtering
- Pagination
- Animal status management
- Animal deactivation/reactivation
- Animal relocation

The backend uses a layered architecture consisting of:

`Controller → Service → Repository → PostgreSQL`

---

## 🥛 Milk Production Management

The production module provides daily milk production tracking.

Implemented functionality includes:

- Production record creation
- Production details
- Production editing
- Production listing
- Search
- Filtering
- Pagination
- Production status management
- Production voiding
- Shift-based production records

This provides the core operational workflow for recording milk production against the farm's livestock operations.

---

## 🌡️ Temperature Monitoring

The system includes temperature log management and a temperature simulation process.

Implemented functionality includes:

- Temperature log creation
- Temperature log listing
- Search
- Filtering
- Temperature log details
- Temperature monitoring on dashboards
- Scheduled temperature simulation

The backend contains a scheduled temperature simulator job for generating recurring temperature records for the configured environment.

---

## 👤 Customer Management

The customer module supports the basic customer lifecycle.

Implemented functionality includes:

- Customer registration
- Customer details
- Customer editing
- Customer listing
- Search
- Filtering
- Pagination
- Customer status management

---

## 📦 Order Management

The order module supports both one-time and subscription-based orders.

Implemented functionality includes:

- One-time orders
- Subscription orders
- Order creation
- Order editing
- Order details
- Order listing
- Search
- Filtering
- Pagination
- Order status management
- Order cancellation
- Order reactivation
- Delivery frequency
- Delivery date
- Delivery time preference
- Milk type
- Quantity
- Billing model
- Billing cycle

### Order Cut-off

The system supports an configurable order cut-off time.

Default development configuration:

`16:00`

Orders are processed according to the configured business rules.

---

## 🚚 Delivery Management

The delivery module handles delivery planning and execution.

Implemented functionality includes:

- Delivery generation
- Delivery listing
- Delivery search
- Delivery filtering
- Delivery details
- Delivery assignment
- Delivery status updates
- Delivery staff assignment
- Delivery execution tracking

### Delivery Rules

- Only scheduled deliveries can be assigned.
- Only the Owner can assign deliveries.
- Delivery Staff can view their assigned deliveries.
- Delivery Staff can update the status of assigned deliveries.
- Delivery outcomes include:
  - Successfully Delivered
  - Partially Delivered
  - Failed

### Automated Delivery Planning

Subscription deliveries are not generated immediately when a subscription order is created.

Instead, a scheduled delivery-planning job:

1. Reads the configured delivery cut-off time.
2. Identifies active subscription orders.
3. Determines the next required delivery date.
4. Generates the required deliveries after the configured planning cut-off.


---

## 📊 Role-Based Dashboards

MSMS provides separate dashboards for each supported role.

### Owner Dashboard

Provides an operational overview of the business, including relevant production, customer, order, delivery, and system information.

### Farm Worker Dashboard

Provides farm and production-related information.

### Delivery Staff Dashboard

Provides delivery-related operational information.

### Accountant Dashboard

Provides business and financial-related summary information.

### System Administrator Dashboard

Provides system-level information and administrative controls.

---

## ⚙️ System Configuration

The system includes centralized configuration management.

Configuration records can contain:

- Configuration key
- Configuration value
- Description
- Data type
- Category
- Encryption status
- Created/updated timestamps
- User responsible for updates

Sensitive configuration values can be encrypted using **AES-256-GCM**.

Examples of configurable business settings include:

- Order cut-off time
- Delivery cut-off time

---

# 🏗️ System Architecture

MSMS follows a **feature/module-based architecture** with a separated frontend and backend.

```text
                    ┌───────────────────────────┐
                    │       React Frontend      │
                    │                           │
                    │ React + TypeScript + Vite │
                    │ Tailwind CSS              │
                    └─────────────┬─────────────┘
                                  │
                              Axios / HTTP
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │       Express Backend     │
                    │                           │
                    │ Controllers               │
                    │ Services                  │
                    │ Repositories              │
                    │ Validators                │
                    │ Middleware                │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │       PostgreSQL          │
                    │        Supabase           │
                    └───────────────────────────┘
```

---

# 🖥️ Frontend Architecture

The frontend follows a **feature-based modular architecture**.

```text
frontend/
└── src/
    ├── assets/
    ├── components/
    ├── constants/
    ├── context/
    ├── features/
    │   ├── animals/
    │   ├── auth/
    │   ├── customers/
    │   ├── deliveries/
    │   ├── dashboard/
    │   ├── orders/
    │   ├── production/
    │   ├── users/
    │   ├── systemConfigurations/
    │   └── temperatureLogs/
    ├── hooks/
    ├── layouts/
    ├── routes/
    ├── services/
    ├── types/
    └── utils/
```

### Key Frontend Layers

| Layer | Responsibility |
|---|---|
| `components/` | Shared reusable UI components |
| `features/` | Feature-specific components and pages |
| `context/` | Global React contexts |
| `hooks/` | Reusable custom React hooks |
| `layouts/` | Application layouts |
| `routes/` | Application and role-based routing |
| `services/` | REST API communication |
| `types/` | TypeScript type definitions |
| `constants/` | Application-wide constants |
| `utils/` | Utility/helper functions |

The frontend deliberately uses a shared component layer for common UI elements such as:

- Tables
- Modals
- Dropdowns
- Pagination
- Spinners
- Text fields
- Text areas

You can find the exact structure in `frontend/structure.md`.


---

# ⚙️ Backend Architecture

The backend follows a modular layered architecture.

```text
backend/
└── src/
    ├── config/
    ├── middleware/
    ├── modules/
    │   ├── animals/
    │   ├── auth/
    │   ├── customers/
    │   ├── cron/
    │   ├── production/
    │   ├── temperature-logs/
    │   ├── deliveries/
    │   ├── dashboard/
    │   ├── system-configurations/
    │   ├── orders/
    │   └── users/
    └── shared/
        ├── constants/
        ├── errors/
        ├── types/
        ├── utils/
        └── validators/
```

Each major backend feature is organized into:

```text
index
controller
service
repository
routes
validator
```

Where applicable, modules also contain helpers and scheduled jobs.

You can find the exact structure in `backend/structure.md`.

### Backend Request Flow

```text
HTTP Request
     │
     ▼
Routes
     │
     ▼
Authentication Middleware
     │
     ▼
Authorization Middleware
     │
     ▼
Validation
     │
     ▼
Controller
     │
     ▼
Service
     │
     ▼
Repository
     │
     ▼
PostgreSQL
```

This separation keeps HTTP handling, business logic, database access, and validation independent.

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Static typing |
| Vite | Development/build tooling |
| Tailwind CSS v4 | Styling |
| React Router v7 | Routing |
| Axios | HTTP client |
| React Hook Form | Form management |
| React Toastify | Notifications |
| React Icons | UI icons |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API framework |
| TypeScript | Static typing |
| PostgreSQL | Relational database |
| Supabase | PostgreSQL hosting |
| `pg` | PostgreSQL client |
| JWT | Authentication |
| bcrypt | Password hashing |
| express-validator | Request validation |
| AES-256-GCM | Sensitive configuration encryption |

## Deployment

| Service | Purpose |
|---|---|
| Vercel | Frontend deployment |
| Vercel | Backend deployment |
| Supabase | PostgreSQL database |
| GitHub | Source control |

---

# 🗄️ Database

The backend contains a complete database initialization script:

```text
backend/schema.sql
```

The script contains the required database schema and seeds the required setup data.

This includes the initial configuration/setup values required for the application to operate.

### Database Setup

Create a PostgreSQL/Supabase database and execute:

```text
backend/schema.sql
```

Then configure the backend `DATABASE_URL` to point to the database.

> The application does not use an ORM. Database access is handled directly through the PostgreSQL `pg` client.

---

# 🔑 Environment Variables

## Backend

Create a `.env` file inside `backend/`.

```env
PORT=5000
NODE_ENV=development

DATABASE_URL=postgresql://username:password@host:5432/postgres

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

CONFIG_ENCRYPTION_KEY=your_64_character_hex_encryption_key_here

FRONTEND_URL=http://localhost:5173

CRON_SECRET=your_cron_secret_here
```

### Environment Variable Reference

| Variable | Purpose |
|---|---|
| `PORT` | Backend server port |
| `NODE_ENV` | Application environment |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used for JWT signing |
| `JWT_EXPIRES_IN` | JWT expiration duration |
| `CONFIG_ENCRYPTION_KEY` | AES-256-GCM encryption key |
| `FRONTEND_URL` | Allowed frontend origin |
| `CRON_SECRET` | Secret used for protected scheduled-job endpoints |

> **Security:** Never commit `.env` files, database credentials, JWT secrets, encryption keys, or cron secrets to source control.

---

## Frontend

Create a `.env` file inside `frontend/`.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

The frontend uses this value as the base URL for API requests.

---

# 🚀 Local Development Setup

## Prerequisites

Install the following before starting:

- Node.js
- npm
- PostgreSQL or a Supabase PostgreSQL database
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/IrajFatima/Milk-Supplier-Management-System.git
cd Milk-Supplier-Management-System
```

---

## 2. Configure the Database

Create a PostgreSQL database or Supabase project.

Execute:

```text
backend/schema.sql
```

The script creates the required database structure and setup/seed data.

---

## 3. Configure the Backend

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Add the backend environment variables described above.

---

## 4. Start the Backend

```bash
npm run dev
```

The backend runs locally on:

```text
http://localhost:5000
```

The API base path is:

```text
http://localhost:5000/api
```

---

## 5. Configure the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 6. Start the Frontend

```bash
npm run dev
```

The Vite development server runs on:

```text
http://localhost:5173
```

---

# 🧪 Testing

Automated unit tests are included separately in both projects.

```text
frontend/
└── tests/

backend/
└── tests/
```

The tests are intentionally kept outside the source directories to maintain separation between application code and test code.

### Testing Stack

The project uses **Vitest** for unit testing.

Testing covers the implemented application logic and frontend/backend components according to the project's testing scope.

### Run Tests

From the respective project directory:

```bash
npm test
```

For a production-oriented verification, build the application as well:

```bash
npm run build
```

> Available npm scripts should be checked against the corresponding `package.json` files if the project scripts are changed in future revisions.

---

# 🔒 Security

The application includes several security mechanisms:

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- Protected routes
- Backend authentication middleware
- Backend authorization middleware
- Request validation
- Centralized error handling
- AES-256-GCM encryption for sensitive configuration values
- Environment-based secrets
- CORS configuration
- Secure HTTP middleware
- Inactivity-based frontend logout

Sensitive credentials are not hardcoded into the application.

---

# ⏱️ Scheduled Jobs

The backend includes scheduled jobs for recurring operational processes.

### Temperature Simulation

A scheduled temperature simulator generates temperature log records for the configured environment.

### Delivery Planning

The delivery planning job processes active subscriptions and generates upcoming deliveries according to the configured delivery cut-off rules.

The backend also exposes cron-related functionality through the dedicated cron module.

```text
backend/src/modules/cron/
```

---

# 📋 Business Rules Implemented

Some of the core business rules implemented in the MVP include:

### Authentication

- Users must authenticate before accessing protected functionality.
- Access is controlled by role.
- Unauthorized users cannot access restricted resources.

### Orders

- One-time orders can generate deliveries according to the implemented workflow.
- Subscription orders do not immediately generate recurring deliveries.
- Active subscriptions are processed by the delivery planning job.
- Order cut-off time is configurable.

### Deliveries

- Only scheduled deliveries can be assigned.
- Only Owners can assign deliveries.
- Delivery Staff can access assigned deliveries.
- Delivery Staff can update delivery outcomes.
- Delivery status supports successful, partial, and failed delivery outcomes.
- Delivery cut-off time is configurable.

### User Management

- Owner and System Administrator have administrative capabilities with different restrictions.
- System Administrator cannot create another Owner or System Administrator account through the restricted user-management workflow.

---

# 👤 Demo Credentials

The deployed application can be tested using the following accounts:

| Username | Password | Role |
|---|---|---|
| `owner` | `user12345` | Owner |
| `delivery` | `user123` | Delivery Staff |
| `accountant` | `user123` | Accountant |
| `farmworker` | `user123` | Farm Worker |
| `sysadmin` | `user123` | System Administrator |

> **Important:** These are demonstration credentials for the deployed MVP. They must not be reused in a production environment.

---

# 📁 Project Structure

```text
Milk-Supplier-Management-System/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── context/
│   │   ├── features/
│   │   │   ├── animals/
│   │   │   ├── auth/
│   │   │   ├── customers/
│   │   │   ├── deliveries/
│   │   │   ├── dashboard/
│   │   │   ├── orders/
│   │   │   ├── production/
│   │   │   ├── users/
│   │   │   ├── systemConfigurations/
│   │   │   └── temperatureLogs/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── tests/
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── animals/
│   │   │   ├── auth/
│   │   │   ├── customers/
│   │   │   ├── cron/
│   │   │   ├── production/
│   │   │   ├── temperature-logs/
│   │   │   ├── deliveries/
│   │   │   ├── dashboard/
│   │   │   ├── system-configurations/
│   │   │   ├── orders/
│   │   │   └── users/
│   │   └── shared/
│   │       ├── constants/
│   │       ├── errors/
│   │       ├── types/
│   │       ├── utils/
│   │       └── validators/
│   ├── tests/
│   ├── schema.sql
│   ├── package.json
│   ├── tsconfig.json
│   └── vercel.json
│
└── README.md
```

---

# 📐 Development Principles

The project was implemented around the following architectural principles:

- **Separation of concerns**
- **Feature-based frontend organization**
- **Layered backend architecture**
- **Reusable UI components**
- **Strong TypeScript typing**
- **Centralized API service layer**
- **Role-based access control**
- **Reusable validation and error handling**
- **Database-driven business configuration**
- **Minimal dependency footprint**

The implementation intentionally avoids introducing unnecessary libraries and keeps business logic within the existing service architecture.

---

# 📈 MVP Scope vs. Full SRS

MSMS should be understood as an **MVP implementation**, not the complete realization of every requirement described in the SRS.

### Implemented in the MVP

- Authentication
- Authorization
- Static RBAC
- User Management
- Animal Management
- Milk Production Tracking
- Customer Management
- Order Management
- Subscription Orders
- Delivery Planning
- Delivery Execution
- Role-Based Dashboards
- Temperature Monitoring
- System Configuration
- Scheduled Jobs
- REST API
- PostgreSQL persistence
- Unit Testing

### Future Expansion

The architecture provides a foundation for expanding the system toward the broader SRS vision, including deeper functionality around:

- Farm inventory
- Advanced livestock management
- Expanded financial management
- Comprehensive billing and ledger workflows
- Procurement
- Expense management
- Advanced reporting
- Analytics
- More sophisticated logistics
- Additional automation
- More detailed operational workflows

The MVP deliberately prioritizes the core business workflows required to demonstrate the system's architecture and primary operational capabilities.

---

# 🔄 Deployment

The application is deployed using Vercel.

```text
                 GitHub
                    │
                    ▼
              ┌──────────┐
              │  Vercel  │
              └────┬─────┘
                   │
          ┌────────┴────────┐
          ▼                 ▼
   Frontend Deployment   Backend Deployment
          │                 │
          │                 ▼
          │            PostgreSQL
          │             (Supabase)
          │
          └────── HTTP API ──────►
```

### Production Components

- **Frontend:** React/Vite application deployed on Vercel
- **Backend:** Express/Node.js API deployed on Vercel
- **Database:** PostgreSQL hosted through Supabase
- **Source Control:** GitHub
- **Scheduled Processing:** Backend cron/scheduled-job architecture

---

# 🧩 API

The backend exposes a REST API organized by feature.

Major API areas include:

```text
/api/auth
/api/users
/api/animals
/api/customers
/api/orders
/api/deliveries
/api/production
/api/dashboard
/api/system-configurations
/api/temperature-logs
/api/cron
```

The backend uses controllers, services, repositories, validators, middleware, and shared types to keep API implementation modular.

---

# 🛠️ Troubleshooting

## Frontend cannot connect to backend

Verify:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Also verify that the backend is running.

---

## Backend cannot connect to PostgreSQL

Check:

```env
DATABASE_URL=postgresql://username:password@host:5432/postgres
```

Confirm that:

- PostgreSQL/Supabase is accessible.
- Credentials are correct.
- `schema.sql` has been executed.
- Network/database access is enabled.

---

## Authentication fails

Verify that:

- The database contains the required seed users.
- `JWT_SECRET` is configured.
- The frontend is pointing to the correct backend URL.
- The backend is running.

---

## Scheduled functionality does not execute

Verify:

- The backend deployment is active.
- Cron configuration is correctly deployed.
- `CRON_SECRET` is configured where required.
- Required system configuration values exist in the database.
- The configured cut-off times are valid.

---

# 📚 Documentation

| Resource | Link |
|---|---|
| 🌐 Live Frontend | https://msms-murex.vercel.app/ |
| ⚙️ Backend API | https://msmsbackend.vercel.app/ |
| 💻 GitHub Repository | https://github.com/IrajFatima/Milk-Supplier-Management-System |
| 📄 MSMS SRS | https://app.notion.com/p/Milk-Supplier-Management-System-SRS-3980fe186722805fbe8bcb1fd86d6ea1?source=copy_link |

---

# 👨‍💻 Project Status

**Status: MVP Completed**

The current implementation provides a functional end-to-end MVP covering the primary operational workflows defined for the initial MSMS release.

The system includes:

- A React-based frontend
- A modular Express REST API
- PostgreSQL persistence
- JWT authentication
- Role-based authorization
- Automated scheduled processes
- Role-specific dashboards
- Unit tests
- Production deployments

The application is structured to support continued development toward the complete MSMS SRS.

---

# 📄 License

This project was developed as part of a software engineering project/internship implementation.

Refer to the repository for the applicable project ownership and licensing information.
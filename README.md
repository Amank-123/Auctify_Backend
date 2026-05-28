# AUCTIFY BACKEND

## Production-Grade Real-Time Auction Platform Backend

Auctify Backend is a scalable event-driven auction infrastructure built using Node.js, Express.js 5, MongoDB, Socket.IO, Redis, BullMQ, and Docker.

The backend powers:

- Real-time auction synchronization
- Live bidding engine
- Seller-buyer private messaging
- OAuth authentication
- Distributed socket communication
- Queue-based background processing
- Scheduled auction orchestration
- Secure payment workflows
- Media processing pipelines
- Scalable API architecture

The system is designed using modular architecture and distributed communication patterns commonly found in modern real-time marketplace systems.

---

# Core Features

## Authentication & Authorization

- JWT Authentication
- Refresh Token System
- Google OAuth Login
- GitHub OAuth Login
- Protected Route Middleware
- Role-Based Access Control
- Secure Cookie Handling

---

## Real-Time Auction System

- Live bid synchronization
- Instant bid broadcasting
- Real-time auction updates
- Auction room management
- Automatic auction start/end
- Bid validation system
- Concurrent bid handling

---

## Real-Time Chat System

- Seller-buyer private messaging
- Socket.IO room architecture
- Live conversation synchronization
- Instant message broadcasting
- Persistent message handling

Because apparently humans cannot simply purchase products peacefully. They must compete publicly while simultaneously opening chat windows to negotiate emotional warfare in real time.

---

## Queue & Worker Architecture

Powered using BullMQ + Redis.

### Worker Responsibilities

- Auction scheduling
- Automatic auction start
- Automatic auction ending
- Delayed background jobs
- Queue execution
- Retry handling
- Event-driven task processing

---

## Payment Infrastructure

- Razorpay integration
- Payment order generation
- Signature verification
- Secure transaction handling

---

## Media Infrastructure

- Cloudinary media storage
- Multer upload handling
- Sharp image optimization
- FFmpeg media processing

---

# Tech Stack

## Core Backend Technologies

| Technology     | Purpose                         |
| -------------- | ------------------------------- |
| Node.js        | Runtime Environment             |
| Express.js 5   | Backend Framework               |
| MongoDB        | NoSQL Database                  |
| Mongoose       | ODM                             |
| Socket.IO      | Real-time Communication         |
| Redis          | Distributed Communication Layer |
| BullMQ         | Queue Management                |
| JWT            | Authentication                  |
| Passport.js    | OAuth Middleware                |
| Razorpay       | Payment Gateway                 |
| Zod            | Schema Validation               |
| Nodemailer     | Email Services                  |
| Cloudinary     | Cloud Media Storage             |
| Docker         | Containerization                |
| Docker Compose | Multi-Service Orchestration     |

---

# Backend Architecture

## Architecture Patterns Used

- MVC Architecture
- Modular Folder Structure
- Event-Driven Architecture
- Queue-Based Processing
- Distributed Socket Architecture
- Middleware-Based Security
- Service Layer Pattern
- Worker-Based Background Processing

---

# Project Structure

```bash
src/
├── config/
├── controllers/
├── limiters/
├── middlewares/
├── models/
├── queues/
├── routes/
├── services/
├── socket/
├── utils/
├── validation/
├── workers/
├── app.js
├── constant.js
└── index.js
```

---

# API Categories

## Authentication APIs

- Register
- Login
- Logout
- Refresh Tokens
- OAuth Authentication
- Session Validation

---

## User APIs

- User Profile
- Avatar Management
- Account Management
- User Activity

---

## Auction APIs

- Create Auction
- Update Auction
- Delete Auction
- Auction Listings
- Auction Details
- Auction Scheduling

---

## Bid APIs

- Place Bid
- Bid Validation
- Bid Tracking
- Real-time Bid Synchronization

---

## Chat APIs

- Chat Room Management
- Conversation Handling
- Message History
- Real-time Messaging

---

## Notification APIs

- Notification Retrieval
- Live Notifications
- Auction Alerts

---

## Category APIs

- Category Management
- Auction Categorization

---

## Banner APIs

- Banner Management
- Promotional Content

---

## OTP APIs

- OTP Generation
- Verification Flows

---

## Payment APIs

- Razorpay Order Creation
- Payment Verification
- Signature Validation

---

## Order APIs

- Order Creation
- Winner Handling
- Purchase Tracking

---

## Chatbot APIs

- AI Chatbot Communication
- AI-assisted Interaction

---

# Advanced Rate Limiting System

Auctify implements layered distributed rate limiting using Express Rate Limit + Redis.

## Custom Limiters

```bash
src/limiters/
├── auth.limiter.js
├── oauth.limiter.js
├── protectedApi.limiter.js
└── publicApi.limiter.js
```

---

## Rate Limiting Layers

### Authentication Limiter

Protects login/register endpoints against:

- Brute-force attacks
- Credential stuffing
- Excessive login attempts

---

### OAuth Limiter

Dedicated protection for:

- Google OAuth
- GitHub OAuth
- Third-party auth abuse prevention

---

### Protected API Limiter

Applied to:

- User routes
- Auction management
- Bid placement
- Chat systems
- Payment systems

---

### Public API Limiter

Handles:

- Public auction browsing
- Categories
- Search endpoints
- Public resources

---

# Redis Infrastructure

Redis plays a central role in Auctify’s distributed architecture.

## Redis Responsibilities

### BullMQ Queue Backend

Redis manages:

- Queue persistence for the `auctionQueue` BullMQ queue
- Delayed jobs and retries
- Worker communication
- Redis-backed queue execution for auction lifecycle tasks

---

### Socket.IO Distributed Adapter

Redis enables:

- Cross-instance socket synchronization
- Distributed event broadcasting
- Shared socket communication state

---

### Distributed Rate Limiting

Redis stores:

- Shared limiter state
- Request tracking
- Traffic control counters

---

# Worker System

## Auction Worker Architecture

The backend starts a dedicated BullMQ worker from `src/workers/auction.worker.js` to process the `auctionQueue` job stream. The worker handles `startAuction` and `endAuction` jobs, while the API server restores any missed auction schedules on boot.

### Worker Tasks

- Start scheduled auctions
- End expired auctions
- Emit real-time socket events through the worker Socket.IO adapter
- Execute delayed processing
- Handle asynchronous auction logic

---

## Worker Flow

```bash
Auction Scheduled
        ↓
BullMQ Queue (`auctionQueue`)
        ↓
Redis Queue Storage
        ↓
Dedicated Worker (`src/workers/auction.worker.js`)
        ↓
Auction Service Execution
        ↓
Socket.IO Event Broadcast
```

---

# Real-Time Socket Architecture

Auctify uses distributed Socket.IO communication with Redis Adapter.

## Socket Systems

- Auction synchronization
- Live bid broadcasting
- Notification delivery
- Seller-buyer messaging
- Room synchronization
- Cross-instance socket scaling

---

## Socket Features

- Room-based communication
- Real-time event emission
- Shared Redis adapter
- Distributed event propagation

---

# Docker Containerization

The development environment is fully containerized using Docker and Docker Compose. The stack includes Redis, the Express API server, and the dedicated auction worker.

## Docker Services

### Redis Container

Handles:

- BullMQ queue storage and retry state
- Redis-backed Socket.IO adapter communication
- Shared distributed state for rate limiting and event coordination
- Persistent data through a named Docker volume

---

### Backend Container

Runs:

- Express API server
- Authentication and OAuth flows
- Auction and bidding engine
- Socket.IO server
- Real-time notifications and chat handling

---

### Worker Container

Dedicated worker service for:

- Scheduled auction execution
- Queue processing through BullMQ (`auctionQueue`)
- Background job handling
- Auction lifecycle updates
- Running `node src/workers/auction.worker.js` inside the container

---

# Docker Architecture

The compose file uses a Redis health check, named volume persistence, and environment loading from a local `.env` file.

```yaml
services:
    redis:
        image: redis:7-alpine
        restart: unless-stopped
        command: redis-server --appendonly yes
        healthcheck:
            test: ["CMD", "redis-cli", "ping"]
            interval: 10s
            timeout: 5s
            retries: 5
        volumes:
            - redis-data:/data

    backend:
        build: .
        ports:
            - "5000:5000"
        depends_on:
            redis:
                condition: service_healthy
        env_file:
            - .env
        restart: unless-stopped
        working_dir: /app
        volumes:
            - .:/app
            - /app/node_modules

    worker:
        build: .
        command: node src/workers/auction.worker.js
        depends_on:
            redis:
                condition: service_healthy
        env_file:
            - .env
        restart: unless-stopped
        working_dir: /app
        volumes:
            - .:/app
            - /app/node_modules

volumes:
    redis-data:
```

---

# Security Features

- JWT Authentication
- OAuth Authentication
- bcrypt Password Hashing
- Helmet Security
- Distributed Rate Limiting
- Validation Middleware
- Protected APIs
- Secure Payment Verification

---

# Environment Variables

Create a local `.env` file before running the backend or Docker services. The compose file loads this file into both the API container and worker container.

```env
PORT=5000
CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
BASE_URL=http://localhost:5000

MONGO_URI=your_mongodb_uri
REDIS_URL=redis://redis:6379

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=30m
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=15d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GIT_CLIENT_ID=your_github_client_id
GIT_CLIENT_SECRET=your_github_client_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

AUTH_RATE_LIMIT_MAX=20
OAUTH_RATE_LIMIT_MAX=10
API_RATE_LIMIT_MAX=50
PUBLIC_API_RATE_LIMIT_MAX=500
```

The runtime reads these values for MongoDB, Redis, JWT auth, OAuth callbacks, email delivery, Razorpay, Cloudinary, and rate limiting.

- `BASE_URL` is used for the Google OAuth callback.
- `CLIENT_URL` is used to redirect users after successful OAuth login.
- `EMAIL_USER` / `EMAIL_PASS` power the nodemailer OTP flow.
- `RAZORPAY_KEY_SECRET` is also used to verify payment signatures.

---

# Quick Start

## Clone Repository

```bash
git clone <repository_url>
cd Auctify_Backend
```

---

## Local Development

Install dependencies and start the API in development mode:

```bash
npm install
npm run dev
```

The `dev` script runs `nodemon --exec node -r dotenv/config src/index.js`, so local development loads variables from `.env` automatically. The API starts after MongoDB connection, configures Socket.IO with Redis, and restores pending auction jobs on boot.

The server is mounted under `/api/*`, including `/api/auction`, `/api/bid`, `/api/order`, `/api/payment`, `/api/otp`, `/api/chat`, `/api/notify`, `/api/Room`, `/api/message`, `/api/category`, and `/api/banner`.

---

## Docker Development

Start the full stack with Redis, backend, and worker containers:

```bash
docker compose up --build
```

Useful container commands:

```bash
docker compose ps

docker compose logs -f backend

docker compose logs -f worker

docker compose down

docker compose down -v
```

If you need to rebuild after env changes or dependency updates, run:

```bash
docker compose up --build
```

---

# Advanced Engineering Concepts Implemented

- Real-Time Systems
- Event-Driven Architecture
- Distributed Socket Scaling
- Queue-Based Background Processing
- Worker-Based Execution
- OAuth Authentication
- Redis Pub/Sub Systems
- Concurrent Bid Handling
- Docker Containerization
- Distributed Rate Limiting
- Media Processing Pipelines
- Optimistic Real-Time Synchronization
- Service-Oriented Backend Structure

---

# Scalability Features

- Redis Adapter Scaling
- BullMQ Worker Separation
- Stateless APIs
- Queue-Based Processing
- Distributed Event Systems
- Modular Service Architecture
- Dockerized Services
- Independent Worker Containers

---

# Development Tools

- Docker
- Docker Compose
- Nodemon
- Prettier
- MongoDB Compass
- Postman
- Visual Studio Code

---

# Deployment Ready

The backend architecture is deployment-ready for:

- AWS
- Render
- Railway
- DigitalOcean
- Docker Infrastructure

---

# Author

## Gautam Singh & Aman Kumar

Full Stack Developer focused on scalable real-time systems and production-grade web application architecture.

---

# Final Note

Auctify Backend was designed to simulate production-level real-time marketplace infrastructure using distributed communication systems, queue-based workers, scalable socket architecture, and event-driven backend engineering.

Which is the professional engineering translation of:
“multiple humans aggressively spamming bid buttons while Redis, workers, and Socket.IO collectively attempt to preserve reality.”

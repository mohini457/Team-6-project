🚀 Overview

Millions of tons of food are wasted daily while many people go hungry. This system bridges that gap by enabling:

📍 Real-time donation posting
🚴 Hyper-local volunteer matching
⏱ Time-sensitive pickup coordination
🔐 Secure OTP-based handover
📊 Impact tracking (meals saved)
🧱 Tech Stack
Frontend
React (Vite)
Tailwind CSS
Context API (State Management)
WebSockets (STOMP via SockJS)
Backend
Java Spring Boot
Spring Security (JWT Authentication)
Spring WebSocket
Spring Scheduler
Database
PostgreSQL
📂 Project Structure
WeB_D_Test/
│
├── backend/        # Spring Boot application
│   ├── src/
│   ├── pom.xml
│
├── frontend/       # React + Vite application
│   ├── src/
│   ├── package.json
🔐 Authentication & Roles
JWT-based authentication
Role-based access control:
DONOR
VOLUNTEER
ADMIN

Endpoints:

POST /auth/signup
POST /auth/login
🔁 Core Features
👤 Donor Flow
Create donation (type, quantity, expiry, image)
Auto-detect location
Publish request
Generate OTP for handover
Track donation status
🚴 Volunteer Flow
Receive real-time alerts
View nearby donations
Claim donation (locked system)
Navigate to donor
Verify OTP during pickup
Mark as delivered (with proof)
🛠 Admin Flow
View all active donations
Track completed deliveries
Monitor total meals saved
View system activity logs
⚙️ Backend Highlights
🔒 Pessimistic Locking

Prevents multiple volunteers from claiming the same donation:

@Lock(LockModeType.PESSIMISTIC_WRITE)
⚡ Real-time Notifications
WebSocket Topic:
/topic/donations
Triggered when new donation is created
🔢 OTP Verification
Generated at claim time
Verified at pickup
Ensures secure handover
⏳ Expiry Scheduler
Runs every minute
Marks expired donations automatically
🎨 Frontend Highlights
🧠 State Management
AuthContext.jsx → User authentication state
WebSocketContext.jsx → Real-time updates
📊 Dashboards
Donor Dashboard
Create donation
Track status (Pending / Claimed / Completed)
Volunteer Dashboard
Live donation feed
Claim → Pickup → Deliver flow
Admin Dashboard
Total meals saved
Active requests
Activity logs
🎨 UI Features
Tailwind custom theme
Clean card-based layouts
Countdown timers for expiry
Real-time UI updates
🧮 Impact Calculation
1 unit (or kg) = 4 meals

Used to calculate:

Total meals saved
Donor impact stats
🚀 How to Run
🗄️ Prerequisites
PostgreSQL running on:
localhost:5432
Create database:
food_donation
Credentials:
username: postgres
password: postgres
▶️ Run Backend
cd backend
mvn spring-boot:run
💻 Run Frontend
cd frontend
npm install
npm run dev
🧪 Build Verification
Backend
mvn clean install -DskipTests
Frontend
npm run build
📡 API Endpoints (Sample)
POST   /donations
GET    /donations/nearby
POST   /donations/{id}/claim
POST   /donations/{id}/verify-otp
POST   /donations/{id}/complete
🔥 Key Features Summary
✅ Real-time donation alerts
✅ Geo-based filtering
✅ Secure OTP verification
✅ Expiry-based system
✅ Role-based dashboards
✅ Impact tracking
🌍 Impact

This platform transforms surplus food into meaningful meals by:

Reducing food waste ♻️
Supporting NGOs 🤝
Feeding the hungry 🍽
📌 Future Improvements
📱 Mobile app (React Native / Flutter)
🗺 Advanced route optimization
🔔 Push notifications (FCM)
🤖 AI-based demand prediction
🌐 Multi-language support

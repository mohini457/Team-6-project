## 🚀 Food Donation & Pickup Coordination System – Overview

A full-stack, real-time platform designed to connect food donors with nearby volunteers/NGOs, enabling fast and secure redistribution of surplus food.

---

## 🧱 Tech Stack

- **Frontend:** React + Vite + Tailwind CSS  
- **Backend:** Spring Boot (Java)  
- **Database:** PostgreSQL  
- **Realtime:** WebSockets (STOMP + SockJS)  
- **Security:** JWT Authentication  

---

## ⚙️ Backend Highlights

- 🔐 **JWT Authentication** with role-based access (DONOR, VOLUNTEER, ADMIN)  
- 🔒 **Pessimistic Locking** to prevent multiple claims  
- ⚡ **Real-time Alerts** using WebSockets (`/topic/donations`)  
- 🔢 **OTP Verification** for secure food handover  
- ⏳ **Expiry Scheduler** auto-marks stale donations as **EXPIRED**  

---

## 🎨 Frontend Highlights

- 🎨 Clean UI with **Tailwind CSS custom theming**  
- 🔄 Real-time updates via **WebSocket integration**  
- 🧠 State management using:
  - `AuthContext.jsx`
  - `WebSocketContext.jsx`

---

## 📊 Key Dashboards

- 👤 **Donor Dashboard:** Create & track donations  
- 🚴 **Volunteer Dashboard:** Claim → Pickup → Deliver flow  
- 🛠 **Admin Dashboard:** Monitor activity & total meals saved  

---

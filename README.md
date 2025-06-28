# 🥗 EcoFridge

A full-stack web application that helps users track food items, receive expiry alerts, and reduce food waste. Built using **React**, **Firebase Authentication**, **Express.js**, and **MongoDB**, this system ensures secure, intuitive, and mobile-responsive food management.

---

## 🌐 Live Demo

👉 [Click here to view the live site](https://ecofridge.netlify.app/)

---

## Project Overview

EcoFridge is a full-stack Food Expiry Tracker System designed to help users efficiently manage their food inventory and reduce food waste by monitoring expiry dates and providing timely alerts. The system enables users to add, view, update, and manage food items securely, with robust authentication and data handling on both client and server sides.

This repository contains both the **client** and **server** components of EcoFridge, each implemented with best practices in modern web development, including secure JWT-based authentication using Firebase on both ends.

---

## Client-Side Application

The client-side is a React-based web application that provides a user-friendly interface for interacting with the EcoFridge service. It includes features for browsing food items, adding new entries, viewing details, and managing personal inventories. 

### Key Features

- **Responsive UI:** Fully responsive design compatible with desktop, tablet, and mobile devices.
- **Food Management:** Ability to add, update, delete, and view food items.
- **Expiry Notifications:** Highlights nearly expired and expired food items with countdowns.
- **Authentication:** Firebase JWT-based authentication supporting email/password login and Google sign-in.
- **Access Control:** Protected routes that ensure only authenticated users can access private pages.
- **Search and Filter:** Search food items by title or category and filter by category.
- **Animations:** Engaging UI animations using Framer Motion.
- **User Notes:** Add and view notes on food items with user-based access control.
- **Security:** Firebase configuration keys secured via environment variables.

### Technologies Used

- React.js with Hooks and Context API
- Tailwind CSS for styling
- Firebase Authentication with JWT tokens
- React Router DOM for routing
- Axios for HTTP requests

---

## Server-Side Application

The server-side is a Node.js/Express backend that manages data persistence, authentication, and business logic. It securely exposes RESTful APIs to the client and ensures data integrity and access control.

### Folder Structure

```

food-expiry-tracker-system-server/
│
├── node_modules/
├── .env
├── .gitignore
├── firebase-adminsdk.json
├── index.js
├── key-convert.js
├── package.json
├── package-lock.json
└── vercel.json

```



### Key Features

- **JWT Authentication:** Firebase JWT tokens are verified on the server to secure API endpoints.
- **User Management:** Registration and login verification integrated with Firebase Authentication.
- **Food CRUD APIs:** Create, read, update, and delete food items tied to authenticated users.
- **Notes Management:** Add and retrieve notes linked to specific food items.
- **Authorization Middleware:** Secures sensitive routes by validating JWT tokens.
- **Environment Variables:** Securely manages MongoDB connection strings, JWT secrets, and Firebase credentials.
- **Firebase Admin SDK:** Used to verify JWT tokens and manage Firebase services.
- **Deployment Ready:** Configured for deployment on Vercel or similar platforms with production-ready settings.

### Technologies Used

- Node.js with Express.js
- MongoDB with Mongoose ODM
- Firebase Admin SDK for JWT verification
- JSON Web Tokens (JWT)
- Vercel deployment

---

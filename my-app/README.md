
## 📁 Project Structure

```
my-app/
├─ client/                     # React Frontend
│  ├─ Dockerfile               # Frontend Docker build instructions
│  ├─ package.json
│  ├─ public/
│  │  └─ index.html
│  └─ src/
│     ├─ app.js                # Main React app component
│     ├─ index.js              # React entry point
│     ├─ pages/
│     │  └─ Register.js        # Register page component
│     └─ styles.css            # Global styles
│
├─ server/                     # Node.js Backend
│  ├─ Dockerfile               # Backend Docker build instructions
│  ├─ .env                     # Environment variables (DB_URI, PORT, etc.)
│  ├─ package.json
│  ├─ src/
│  │  ├─ config/
│  │  │  └─ db.js              # MongoDB connection setup
│  │  ├─ controllers/
│  │  │  └─ userController.js  # Logic for user registration/login
│  │  ├─ middleware/
│  │  │  └─ errorMiddleware.js # Custom error handler
│  │  ├─ models/
│  │  │  └─ user.js            # Mongoose user schema
│  │  ├─ routes/
│  │  │  └─ userRoutes.js      # Express routes for user API
│  │  └─ server.js             # Express app entry point
│  └─ test_api.http            # VSCode REST Client test file
│
├─ docker-compose.yml          # Define services for client, server, and MongoDB
```

---

## 🧠 Overview

- **Frontend**: Built with React, located in `/client`
- **Backend**: Built with Node.js and Express, located in `/server`
- **Database**: MongoDB running inside a Docker container

---

## ⚙️ Setup Instructions

### 1️⃣ Prerequisites
Make sure you have installed:
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- Node.js (for local testing, optional)

---

### 2️⃣ Create an `.env` file in `/server`:
```bash
PORT=5000
MONGO_URI=mongodb://mongo:27017/mydatabase
```

> Note: The hostname `mongo` refers to the **MongoDB container name** in Docker Compose.

---

### 3️⃣ Run all services with Docker
From the root of your project:
```bash
docker-compose up --build
```

This will start:
- **client** on: `http://localhost:3000`
- **server** on: `http://localhost:5000`
- **mongo** on: port `27017`

---

### 4️⃣ Test the Backend API
You can test your backend using **VSCode REST Client** with the file:
```
server/test_api.http
```

Example request (inside `test_api.http`):
```http
### Register user
POST http://localhost:5000/api/users/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "123456"
}
```

---

## 🔗 Connecting Frontend to Backend

Your React frontend should send requests to:
```
http://localhost:5000/api/users/
```

Example (inside `Register.js`):
```js
fetch("http://localhost:5000/api/users/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, email, password }),
});
```

---

## Docker Commands Cheat Sheet

```bash
# View running containers
docker ps

# Stop containers
docker-compose down

# Restart specific service
docker-compose restart server

# Open Mongo shell
docker exec -it <mongo_container_id> mongosh
```

---

## 💾 Database Info

- Default MongoDB container name: `mongo`
- Default database name: `mydatabase`
- Default port: `27017`

To connect manually:
```bash
docker exec -it mongo mongosh
use mydatabase
db.users.find()
```

---

## 🧰 Useful Development Tips

- Use `.env` to store sensitive data like DB URIs and JWT secrets.
- To test backend locally (without Docker), run:
  ```bash
  cd server
  npm install
  npm run dev
  ```
- To test frontend locally:
  ```bash
  cd client
  npm install
  npm start
  ```



# 🔐 User Session API – React + Node.js + MongoDB

A secure authentication API built with **Node.js, Express, MongoDB (Mongoose), and JWT cookies**, integrated with React frontend and deployed on Render.

---

## 🚀 Live Demo

The API is deployed and running on Render.  
Used in production with a React app deployed on **Vercel**.

https://user-session-react-node.vercel.app/login

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Backend Runtime** | Node.js |
| **Server Framework** | Express |
| **Authentication** | JSON Web Token (JWT), Cookies |
| **Database** | MongoDB, Mongoose ODM |
| **Security & Validation** | bcrypt password hashing, Zod schema validation, CORS, cookie flags (httpOnly, secure, sameSite) |
| **Deploy** | Render (backend), Vercel (frontend) |
| **Frontend Integration** | Fetch API + Axios requests, JWT stored in cookies for session persistence |

---

## ✅ Features

- User **Register & Login** endpoints
- Password encrypted using **bcrypt**
- Schema validation using **Zod**
- Session persistence with **JWT stored in cookies**
- Protected routes (`/checkSesion`)
- Cookie-based auth, secure from client-side access
- ✅ Handles **Cross-Origin requests from deployed frontend**
- Automatic redeploys via GitHub integration

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Create new user (username, password) |
| `POST` | `/login` | Login and generate JWT cookie |
| `POST` | `/logout` | Clear auth cookie and end session |
| `GET` | `/checkSesion` | Validate session cookie (Protected) |

---

## 🔒 Cookie Configuration

Authentication token is stored in cookies with the following flags:

```js
res.cookie('access_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 1000 * 60 * 60
})

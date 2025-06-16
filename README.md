### 📁 Project Structure: SCS Web App (MERN Stack)
```
project_root/
│
├── backend/                    # 🔙 Backend (server-side code)
│   ├── config/                 # 📡 Setup files (e.g. connect to MongoDB or Google login)
│   ├── controllers/            # 🧠 Functions that handle what each route should do ((e.g. save user in registerUser())
│   ├── middleware/             # 🛡 Code that runs before certain routes (e.g. checking login token)
│   ├── models/                 # 🗃 MongoDB database structure (e.g. user data shape)
│   ├── routes/                 # 🚏 Define Backend URLs (e.g. POST /api/register → registerUser)
│   ├── server.js               # 🚀 Main backend file — starts the server and connects everything
│   ├── .env                    # 🔐 Secrets (DB password, API keys, etc)
│   └── package.json            # 📦 Lists what packages are used (express, mongoose, etc)
│
├── frontend/                   # 🎨 Frontend (the UI people see)
│   ├── public/                 # 🗂 The base HTML file and static files like images
│   ├── src/                    # 📁 All main code for the website
│   │   ├── components/         # 🧩 Reusable parts like buttons, forms, headers, etc.
│   │   ├── pages/              # 📄 Different pages (e.g. Home, Signup, Dashboard)
│   │   ├── api/                # 🔌 Functions to talk to the backend (e.g. register user)
│   │   ├── contexts/           # 🧠 Shares important data across pages (e.g. user info, app settings)
│   │   └── App.js              # 🧠 Connects all pages and routes together
│   │
│   ├── .env                    # 🌐 Stores backend URL for API calls
│   ├── package.json            # 📦 Lists packages used in frontend (like React, Axios)
│
└── README.md                   # 📘 Overview of the whole project (this file)

### 📁 Project Structure: SCS Web App (MERN Stack)
```
scs-webapp/
│
├── backend/                    # Node.js + Express + MongoDB + JWT + Google OAuth
│   ├── config/                 # DB & Passport setup
│   ├── controllers/            # Auth/business logic
│   ├── middleware/             # JWT auth protection
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express route handlers
│   ├── server.js               # Entry point
│   ├── .env                    # Environment variables
│   └── package.json            # Backend dependencies
│
├── frontend/                   # React app (UI)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable components (buttons, forms, etc)
│   │   ├── pages/              # Page views (Home, Dashboard, etc)
│   │   ├── api/                # Functions to call backend APIs
│   │   └── App.js              # Main React entry
│   │
│   ├── .env                    # API URL for frontend
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # or next.config.js
│
└── README.md                   # Project description

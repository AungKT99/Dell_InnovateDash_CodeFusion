# 📁 Project Structure: SCS Web App (MERN Stack)

Project_root/
│
├── backend/                    # Node.js + Express + MongoDB + JWT + Google OAuth
│   ├── config/                 # DB & passport setup
│   ├── controllers/            # Auth/business logic
│   ├── middleware/             # JWT middleware etc.
│   ├── models/                 # Mongoose models
│   ├── routes/                 # Express routes
│   ├── server.js               # Entry point
│   └── .env
│
├── frontend/                   # HTML, CSS, React.js
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page views (e.g., Home, Dashboard)
│   │   ├── api/                # Functions to call backend APIs
│   │   └── App.js              # Main React app
│   ├── package.json
│   └── .env                   # Frontend config (e.g. API URL)
│


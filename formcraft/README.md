# FormCraft — Multi-Step Form Builder

A full-stack drag-and-drop form builder with multi-step support, live preview, and form submissions.

## Tech Stack
- **Frontend**: React + Vite, Zustand, @dnd-kit, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Styling**: Custom CSS (dark theme)

---

## Quick Start

### 1. Prerequisites
- Node.js v18+
- MongoDB running locally on port 27017 (or update `.env` with your Atlas URI)

### 2. Install All Dependencies
```bash
npm run install:all
```

### 3. Configure Environment
Edit `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/formcraft
PORT=5000
```

### 4. Run the Project
```bash
npm run dev
```

This starts both:
- **Frontend** → http://localhost:5173
- **Backend**  → http://localhost:5000

---

## Folder Structure
```
formcraft/
├── client/               # React frontend
│   └── src/
│       ├── components/   # UI components
│       ├── store/        # Zustand state management
│       ├── pages/        # Builder, Preview, Publish pages
│       ├── hooks/        # Custom hooks
│       └── api/          # Axios API calls
└── server/               # Node.js backend
    └── src/
        ├── routes/       # Express routes
        ├── controllers/  # Business logic
        ├── models/       # Mongoose schemas
        ├── middleware/    # Auth, validation
        └── config/       # DB connection
```

## API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET    | /api/forms | Get all forms |
| POST   | /api/forms | Create a form |
| GET    | /api/forms/:id | Get a form |
| PUT    | /api/forms/:id | Update a form |
| DELETE | /api/forms/:id | Delete a form |
| POST   | /api/forms/:id/submit | Submit form response |
| GET    | /api/forms/:id/submissions | Get all submissions |

# Tripaxis ✈️ | AI Travel Planner

A full-stack MERN monorepo application that uses generative AI to extract details from travel documents and organize them into visual horizontal itineraries.

## ✨ Features
- **AI Extraction:** Uploads/parses tickets and vouchers using Gemini AI.
- **Snake-Flow UI:** Displays daily schedules in a clean horizontal scrollable board view.
- **Auth:** Secure user authentication using JWT.

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, Google GenAI SDK
- **Database:** MongoDB Atlas

---

## 📂 Testing Assets (For Trial Purpose)
If you want to test the AI extraction feature instantly, you can find **sample raw ticket images and PDF files** already inside the project repository at:
`frontend/public/`

You can use these files to upload and test how the application parses and visualizes travel schedules.

---

## ⚙️ Local Setup & Requirements

### 1. Clone Repo
```bash
git clone [https://github.com/rahulsr-ai/Ai-travel-planner.git](https://github.com/rahulsr-ai/Ai-travel-planner.git)
cd ai-travel-planner

```

### 2. Backend Setup

```bash
cd backend
npm install

```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key

```

Run the server:

```bash
npm run dev

```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

```

Create a `.env` file inside the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api

```

Run the app:

```bash
npm run dev

```

## 🌐 Live Links

* **Frontend:** [https://tripaxis.netlify.app](https://www.google.com/search?q=https://tripaxis.netlify.app)
* **Backend:** [https://ai-travel-planner-aej7.onrender.com](https://www.google.com/search?q=https://ai-travel-planner-aej7.onrender.com)



# Portfolio App with MongoDB

This is a portfolio website with a React frontend and Express/MongoDB backend.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB:
   - For local MongoDB: Make sure MongoDB is running on `mongodb://localhost:27017`
   - For MongoDB Atlas: Update `MONGODB_URI` in `backend/.env`

4. Seed the database with an admin user:
   ```bash
   npm run seed
   ```
   This creates an admin user with username: `admin`, password: `admin123`

5. Start the backend server:
   ```bash
   npm run dev  # For development with nodemon
   # or
   npm start    # For production
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the root directory:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API URL in `.env` if needed (default is `http://localhost:5000/api`)

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:



### Database Models

- **Profile**: Personal information, social links
- **Project**: Portfolio projects with details
- **Skill**: Technical skills with categories
- **CodingMetric**: Coding platform statistics
- **ContactMessage**: Contact form submissions
- **User**: Admin authentication

<!-- Deploy trigger: Updated for Vercel redeploy --> 

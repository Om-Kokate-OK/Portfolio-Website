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

The frontend will run on `http://localhost:5173`

### Usage

- Visit the portfolio website at `http://localhost:5173`
- Access the admin panel at `http://localhost:5173/admin/login`
- Login with username: `admin`, password: `admin123`

### API Endpoints

- `GET /api/profile` - Get profile information
- `PUT /api/profile` - Update profile
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill
- `GET /api/coding-metrics` - Get coding metrics
- `POST /api/coding-metrics` - Create coding metric
- `PUT /api/coding-metrics/:id` - Update coding metric
- `DELETE /api/coding-metrics/:id` - Delete coding metric
- `GET /api/contact` - Get contact messages
- `POST /api/contact` - Send contact message
- `PUT /api/contact/:id` - Update contact message
- `DELETE /api/contact/:id` - Delete contact message
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register admin user

### Database Models

- **Profile**: Personal information, social links
- **Project**: Portfolio projects with details
- **Skill**: Technical skills with categories
- **CodingMetric**: Coding platform statistics
- **ContactMessage**: Contact form submissions
- **User**: Admin authentication
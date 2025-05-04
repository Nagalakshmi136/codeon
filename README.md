# Simple MERN LMS

A basic Learning Management System (LMS) built with the MERN stack (MongoDB, Express, React, Node.js). Features Admin, Teacher, and Student roles with approval workflows.

## Tech Stack

*   **Frontend:** React.js, React Router, Axios
*   **Backend:** Node.js, Express.js, Mongoose
*   **Database:** MongoDB (using MongoDB Atlas)
*   **Authentication:** JWT, bcryptjs

## Prerequisites

*   Node.js (v16 or later recommended) & npm (or yarn)
*   Git
*   MongoDB Atlas Account (free tier is sufficient)

## Setup

1.  **Clone:**
    ```bash
    git clone <your-repository-url>
    cd <repository-name>
    ```
2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```
3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend # Or 'cd ../client' depending on your folder name
    npm install
    ```
4.  **Configure Backend (`backend/.env`):**
    *   Create a `.env` file in the `backend` directory.
    *   Add the following required variables:
        ```dotenv
        # Get from MongoDB Atlas (replace placeholders)
        MONGO_URI=mongodb+srv://<YourUsername>:<YourPassword>@<YourCluster>.mongodb.net/<YourDbName>?retryWrites=true&w=majority

        # Choose a strong, random secret
        JWT_SECRET=YOUR_REALLY_STRONG_SECRET_KEY

        # Optional: Port for backend (defaults to 5000 if not set)
        # PORT=5000
        ```
5.  **Configure MongoDB Atlas:**
    *   Make sure you have a Database User created in Atlas (use its credentials in `MONGO_URI`).
    *   Whitelist your current IP Address in Atlas Network Access (use `0.0.0.0/0` for easy development access). Wait for it to become "Active".
6.  **Seed Admin User:**
    *   An admin user is required for approvals. You **must** create one.
    *   **Method 1 (If Seed Script Exists):** Run `node seed.js` in the `backend` folder (make sure the script correctly hashes the password).
    *   **Method 2 (Manual):** Register a user normally, then manually change their `role` to `"admin"` and `status` to `"approved"` in the MongoDB Atlas database. **Ensure the password was hashed correctly during registration.**

## Running the Project

You need **two** separate terminals.

1.  **Start Backend:**
    ```bash
    cd backend
    npm run dev
    ```
    *(Server usually runs on http://localhost:5000)*

2.  **Start Frontend:**
    ```bash
    cd frontend # Or 'cd client'
    npm start
    ```
    *(App usually opens automatically at http://localhost:3000)*

3.  **Access:** Open `http://localhost:3000` in your browser. Log in with your admin credentials or register new users.

---
# Simple Node.js API with React Frontend and MongoDB

## Overview

This repository contains a simple CRUD (Create, Read, Update, Delete) application built with Node.js, React, and MongoDB. The application allows users to perform CRUD operations on user data stored in a MongoDB database.

## Technologies Used

- **Node.js**: The backend server is built with Node.js, providing the API endpoints for CRUD operations.
- **Express.js**: Used as the web application framework for Node.js, simplifying the process of building robust APIs.
- **MongoDB**: The database used to store user data.
- **React**: The frontend is built with React, providing an interactive user interface for interacting with the API.
- **React Router**: Used for client-side routing, allowing navigation between different pages of the application.
- **Axios**: Used for making HTTP requests from the React frontend to the Node.js backend.

## How It Works

The application consists of two main components:

- **Backend (Node.js and Express.js)**: Provides API endpoints for performing CRUD operations on user data stored in a MongoDB database. The backend server listens for HTTP requests and interacts with the MongoDB database to create, read, update, or delete user data.
  
- **Frontend (React)**: Provides a user interface for interacting with the backend API. The React application allows users to create new users, view a list of all users, update existing user information, and delete users.

## Project Structure

```plaintext
SIMPLE-NODE.JS-API/
├── .vscode/
├── client/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UserList.js
│   │   │   ├── UserForm.js
│   │   │   └── UserDetail.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package-lock.json
│   ├── package.json
│   └── README.md
├── server/
│   ├── node_modules/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   └── User.js
│   │   └── routes/
│   │       └── userRoutes.js
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── README.md
└── LICENSE
```

## Prerequisites

- **Node.js**: Ensure Node.js is installed and available in your system PATH.
- **npm (Node Package Manager)**: Comes with Node.js, used to install dependencies.
- **MongoDB**: A running instance of MongoDB to store the application data.

## API Endpoints

- **GET /users**: Retrieve a list of all users.
- **GET /users/:userId**: Retrieve a single user by ID.
- **POST /users**: Create a new user.
- **PATCH /users/:userId**: Update an existing user.
- **DELETE /users/:userId**: Delete a user by ID.

## Getting Started

### Step 1: Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/DanielsvsCodes/Simple-Node.js-API
cd SIMPLE-NODE.JS-API
```

### Step 2: Install Dependencies

Install the required dependencies for both the backend and frontend:

```bash
cd server
npm install
cd ../client
npm install
```

### Step 3: Set Up the MongoDB Connection

Set up the MongoDB connection for the backend:

1. Create a `.env` file in the backend directory.
2. Add the MongoDB connection URI to the `.env` file:

```plaintext
MONGODB_URI=mongodb://localhost:{database port}/{name of the table}
```

### Step 4: Start the Backend Server

Start the backend server using the following command:

```bash
cd server
npm run dev
```

### Step 5: Start the Frontend Server

Start the frontend server:

```bash
cd client
npm start
```

### Step 6: Access the Application

Open your web browser and navigate to `http://localhost:3000` to access the application.

## Troubleshooting

- **Cannot Connect to MongoDB**: Ensure that MongoDB is running and the connection string in the `.env` file is correct.
- **Server Crashes**: Check the console output for any errors and ensure all dependencies are installed correctly.
- **Frontend Not Loading**: Make sure the React development server is running and accessible at `http://localhost:3000`.

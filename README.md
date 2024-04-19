# Simple Node.js API with React Frontend and MongoDB

This repository contains a simple CRUD (Create, Read, Update, Delete) application built with Node.js, React, and MongoDB. The application allows users to perform CRUD operations on user data stored in a MongoDB database.

## Features

- Create: Users can create new user entries by providing a name, email, and password.
- Read: Users can view a list of all existing users in the database.
- Update: Users can update existing user entries by providing a valid email and updating the name, email, or password.
- Delete: Users can delete existing user entries by providing a valid email.

## Technologies Used

- Node.js: The backend server is built with Node.js, providing the API endpoints for CRUD operations.
- Express.js: Express.js is used as the web application framework for Node.js, simplifying the process of building robust APIs.
- MongoDB: MongoDB is used as the database to store user data.
- React: The frontend is built with React, providing an interactive user interface for interacting with the API.
- React Router: React Router is used for client-side routing, allowing navigation between different pages of the application.
- Axios: Axios is used for making HTTP requests from the React frontend to the Node.js backend.
- Bootstrap: Bootstrap is used for styling the frontend components, providing a responsive and visually appealing design.

## Installation

1. Clone the repository:
```
git clone https://github.com/WickedSoda/Simple-Node.js-API
```

2. Install dependencies for both the backend and frontend:
```
cd server
npm install
cd ../client
npm install
```

3. Set up the MongoDB connection:
- Create a .env file in the backend directory.
- Add the MongoDB connection URI to the .env file:
```
MONGODB_URI=mongodb://localhost:27017/{name of the table}
```

4. Start the backend server:
```
cd backend
npm run dev
```

5. Start the frontend server:
```
cd client
npm start
```

6. Access the application in your browser at 'http://localhost:3000'.

## API Endpoints

GET /users: Get a list of all users.
GET /users/:userId: Get a single user by ID.
POST /users: Create a new user.
PATCH /users/:userId: Update an existing user.
DELETE /users/:userId: Delete a user by ID.

## Folder Structure

server: Contains the Node.js backend code.
client: Contains the React frontend code.

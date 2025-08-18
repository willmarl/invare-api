# Invare API - Backend

## Description

The Invare API is a Node.js backend built with Express, Mongoose, and MongoDB. It provides a RESTful API for managing users, modules, and inventory, as well as an AI assistant powered by the OpenAI API.

## Features

- **User Authentication:** Secure user registration, login, and authentication using JWT.
- **Module Management:** Create, read, update, and delete modules.
- **Inventory Management:** Create, read, update, and delete inventory items.
- **AI Assistant:** Integration with the OpenAI API for providing an AI assistant.
- **Request Validation:** Request body validation using Joi and Celebrate.
- **Error Handling:** Centralized error handling middleware.
- **Rate Limiting:** Rate limiting middleware to prevent abuse.
- **Logging:** Request logging middleware for debugging and monitoring.

## Technologies Used

- Node.js
- Express
- Mongoose
- MongoDB
- JSON Web Tokens (JWT)
- Joi
- Celebrate
- Winston

## Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2.  Navigate to the project directory:

    ```bash
    cd invare-api
    ```

3.  Install dependencies:

    ```bash
    npm install
    ```

4.  Create a `.env` file in the root directory and configure the following environment variables:

    ```
    PORT=3001
    MONGODB_URI=<your-mongodb-connection-string>
    JWT_SECRET=<your-jwt-secret>
    OPENAI_API_KEY=<your-openai-api-key>
    PROD_ORIGINS=https://invare.app,https://www.invare.app,https://api.invare.app

    ```

    Replace the placeholders with your actual values.

    _look at template.env for more config details_

## Running the Application

1.  Start the MongoDB server.

2.  (First-time setup only) Prepare upload directories and permissions:

    ```bash
    chmod +x setup_dirs.sh
    sudo ./setup_dirs.sh
    ```

    This script creates the necessary uploads/modules directory and sets permissions. Run it before running the seed script.

3.  Start the application:

    ```bash
    npm start
    ```

    or

    ```bash
    npm run dev
    ```

    to start the server with nodemon for automatic restarts on file changes.

4.  The API will be running on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

[Postman Collection](https://willmarl-5644054.postman.co/workspace/William-Marlette's-Workspace~1700bca8-bcde-4108-86e7-b217ae628eba/collection/47471224-21881ad8-9fb1-490d-9096-c73f027a8465?action=share&creator=47471224)

### User Routes

- `POST /v1/users/register`: Register a new user.
- `POST /v1/users/login`: Login an existing user.
- `GET /v1/users/me`: Get the current user's profile.
- `PUT /v1/users/me`: Update the current user's profile.

### Module Routes

- `GET /v1/modules`: Get all modules.
- `GET /v1/modules/:id`: Get a module by ID.
- `GET /v1/modules/by/:id`: Get all modules owned by userID.
- `POST /v1/modules`: Create a new module.
- `PUT /v1/modules/:id`: Update a module by ID.
- `DELETE /v1/modules/:id`: Delete a module by ID.

### Inventory Routes

- `GET /v1/inventories`: Get all inventory items.
- `GET /v1/inventories/:id`: Get an inventory item by user ID.
- `POST /v1/inventories`: Create a new inventory item.
- `PUT /v1/inventories/:id`: Update an inventory item by ID.
- `DELETE /v1/inventories/:id`: Delete an inventory item by ID.

### Assistant Route

- `POST /v1/assistant/`: Send a message to the AI assistant.

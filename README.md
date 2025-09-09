md
# Rate-Limiter-Application

## Project Title & Description

This application implements a robust rate limiting solution using a token bucket algorithm. It provides a backend built with Node.js, Express.js, TypeScript, and MongoDB, and a basic frontend. This system allows you to control the rate at which users or services can access specific resources, preventing abuse and ensuring service stability.

## Key Features & Benefits

-   **Token Bucket Algorithm:** Implements the token bucket algorithm for accurate and flexible rate limiting.
-   **Configurable Rate Limits:**  Define rate limits based on various criteria (e.g., user ID, IP address, API key) with configurable capacity and refill rates.
-   **Backend API:** Provides a RESTful API for managing rate limit rules and consuming tokens.
-   **MongoDB Integration:** Uses MongoDB to persist rate limit data (token counts, last refill times) for scalability and reliability.
-   **Frontend Example:** Includes a simple frontend to demonstrate the rate limiting in action.
-   **TypeScript:** Utilizes TypeScript for type safety and improved code maintainability.

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

-   **Node.js:**  (version 16 or higher recommended) - [https://nodejs.org/](https://nodejs.org/)
-   **npm** (Node Package Manager) - usually bundled with Node.js
-   **MongoDB:**  A running MongoDB instance - [https://www.mongodb.com/](https://www.mongodb.com/)
-   **Typescript:** Installed globally, or included in the project's dependencies.

## Installation & Setup Instructions

Follow these steps to get the project up and running:

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd Rate-Limiter-Application
    ```

2.  **Backend Setup:**

    ```bash
    cd backend
    npm install
    ```

3.  **Configure Environment Variables:**

    -   Create a `.env` file in the `backend` directory.
    -   Add the following environment variables:

        ```
        MONGODB_URI=<your_mongodb_connection_string>  # e.g., mongodb://localhost:27017/rate-limiter
        PORT=3000                                     # Port the backend server will run on
        ```

        Replace `<your_mongodb_connection_string>` with your actual MongoDB connection string.

4.  **Run the Backend:**

    ```bash
    npm run dev
    ```

    This will start the backend server using `ts-node`.

5.  **Frontend Setup (Optional):**

    ```bash
    cd ../frontend
    npm install
    ```

6. **Configure the frontend**

   Modify the `index.html` to point to the running backend address.

7.  **Run the Frontend (Optional):**

    Serve `index.html` using a web server (e.g., using a simple HTTP server):

    ```bash
    # If you have Python installed:
    python -m http.server
    ```

    Then access the frontend via your web browser (e.g. `http://localhost:8000`).  You might need to modify the javascript in the `index.html` to fetch from the correct backend port.

## Usage Examples & API Documentation

### Backend API Endpoints

-   **`POST /counters`**: Creates a new counter rule.  Takes a JSON payload with `identifier`, `capacity` and `refillRate`.
    ```json
    {
      "identifier": "user123",
      "capacity": 10,
      "refillRate": 1
    }
    ```

-   **`GET /counters`**:  Retrieves all counter rules.
-   **`POST /demo/:identifier`**:  Demo endpoint to test rate limiting.  `:identifier` specifies the counter to use.

### Example Usage

To test the rate limiter, send requests to the `/demo/:identifier` endpoint after creating a counter rule using `/counters`. If the rate limit is exceeded, the server will return an appropriate error response.

## Configuration Options

-   **Environment Variables:**
    -   `MONGODB_URI`:  The connection string for your MongoDB database.
    -   `PORT`: The port on which the backend server will listen.

-   **Rate Limit Rules:**
    -   The `capacity` and `refillRate` parameters in the counter rules control the rate limiting behavior.  `capacity` specifies the maximum number of tokens, and `refillRate` determines how many tokens are added per time unit (e.g., per second).

## Contributing Guidelines

We welcome contributions to this project! To contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Implement your changes and write tests.
4.  Submit a pull request with a clear description of your changes.

## License Information

This project has no specified license. All rights are reserved by the owner, pranavrockz.

## Acknowledgments

-   This project utilizes the following open-source libraries:
    -   Express.js
    -   Mongoose
    -   cors
    -   dotenv

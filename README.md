# Cache Manager

Cache Manager is a React application designed to manage cache entries with functionalities for setting and retrieving cache values. It also integrates WebSocket notifications to alert users of new cache entries. 

## Features

- Set cache with a key, value, and duration.
- Retrieve cache values by key.
- Receive real-time notifications through WebSocket when new cache entries are set.
- View notifications in a menu with a bell icon.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm (or Yarn) installed on your machine.
- Access to a WebSocket server running at `ws://localhost:8080/ws`.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/cache-manager.git
    cd cache-manager
    ```

2. **Install dependencies:**

    Using npm:

    ```bash
    npm install
    ```

    Or using Yarn:

    ```bash
    yarn install
    ```

## Usage

1. **Start the development server:**

    Using npm:

    ```bash
    npm start
    ```

    Or using Yarn:

    ```bash
    yarn start
    ```

2. **Open the application in your browser:**

    Navigate to `http://localhost:3000` in your web browser.

## Components

- **CacheManager**: The main component that allows users to set and retrieve cache entries and view real-time notifications.

## API Endpoints

- **GET /cache**: Fetch cache data by key.
- **POST /cache**: Set a new cache entry with a key, value, and duration.
- **DELETE /cache**: (Not implemented) Remove a cache entry by key.

## WebSocket Integration

The application connects to a WebSocket server to receive real-time notifications about new cache entries.

### WebSocket URL

- `ws://localhost:8080/ws`

## Styling

The application uses Material-UI for styling. For custom styles, check `cacheManagement.css`.

## Troubleshooting

- **WebSocket Connection Issues**: Ensure your WebSocket server is running and accessible at the specified URL.
- **Dependencies Errors**: Make sure all required dependencies are installed correctly.
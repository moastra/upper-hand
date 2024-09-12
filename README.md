
# Upper-Hand

Upper-Hand is a rock-paper-scissors game with RPG-like elements. Players can level up their characters to improve stats and use unique power-ups to customize their playstyle. The game utilizes Google's MediaPipe Gesture Recognizer, allowing players to make moves through gestures captured by their webcam, creating an immersive, interactive experience.

## Goal

The main goal of **Upper-Hand** is to combine the simplicity of rock-paper-scissors with the depth of RPG customization, enhancing the traditional game with stat upgrades and power-ups.

## Functional Requirements

**Client-Side Application**

- **React SPA**: Built as a single-page application using React.
- **Webcam Gesture Recognition**: Utilizes Google’s MediaPipe Gesture Recognizer for gesture-based interactions.
- **API Communication**: The client communicates with the backend using HTTP and JSON.

**Server and Persistence Layer**

- **PostgreSQL Database**: Manages user stats, power-ups, and match history.
- **Node.js Express Server**: Provides the API for the React frontend and handles authentication using JWT.
  
## Behavioural Requirements

- **Gesture Moves**: Players use their webcam to gesture rock-paper-scissors moves.
- **Stat Customization**: Players can upgrade their character’s stats and tailor power-ups to their strategy.
- **Game Lobby**: Players can join lobbies and challenge opponents in real-time.
- **Match History**: Users can view their previous matches, which are stored and sorted by date.

## Tech Stack

- **React**: The frontend is built with React.
- **Express.js**: The backend API server is developed with Express.
- **PostgreSQL**: The persistence layer uses PostgreSQL.
- **JSON Web Tokens (JWT)**: Used for secure user authentication.
- **Google's MediaPipe**: For real-time gesture recognition.

## API Reference

#### Log in the user
```http
  POST /api/auth/login
```

#### Fetch user stats
```http
  GET /api/users/:id/stats
```

#### Customize user stats and power-ups
```http
  PUT /api/users/:id/customize
```

## Development Setup

**Upper-Hand** is developed using two servers:

1. **Client-Side Webpack Development Server**: Serves the React application.
2. **API Server**: Provides backend functionality through Express.js and JWT.

## Running the Project

1. **Install Dependencies**: Run `npm install` in both the client and server directories.
2. **Start the API Server**: Navigate to the server directory and run `npm start`.
3. **Start the Client**: In the client directory, run `npm start` to launch the Webpack development server.

## Screenshots

#### Game Lobby
![Game Lobby](path-to-your-image)

#### Stats Customization
![Stats Customization](path-to-your-image)

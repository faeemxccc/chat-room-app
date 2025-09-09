# Chat Room Application

This is a simple chat room application that allows users to join and communicate in real-time without the need for authentication. 

## Features

- User-friendly interface for chatting
- Real-time messaging
- No authentication required for users

## Project Structure

```
chat-room-app
├── src
│   ├── app.js          # Entry point of the application
│   ├── chat
│   │   └── chatRoom.js # Manages chat room functionality
│   ├── users
│   │   └── user.js     # Represents a user in the chat room
│   ├── routes
│   │   └── index.js    # Defines application routes
│   └── views
│       └── index.html   # Main HTML view for the chat room
├── package.json         # Configuration file for npm
└── README.md            # Documentation for the project
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd chat-room-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
node server.js
```
Then, open your browser and go to `http://localhost:3000` to access the chat room.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes. 

## License

This project is licensed under the MIT License.

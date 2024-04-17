
# 01-chatapp

![Chat App Banner](https://i.imgur.com/B6t5pNa.png)

A real-time chat application built using the MERN stack, Socket.io, TailwindCSS, and Daisy UI, providing features such as authentication and authorization with JWT, real-time messaging, online user status, and global state management with Zustand.

[Visit Chat App](https://zero1-chatapp.onrender.com)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Screenshots](#screenshots)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Documentation](#documentation)
- [Contributors](#contributors)
- [License](#license)

## Installation

To set up the Chat App for development:

1. Clone the repository:
   ```bash
   git clone https://github.com/enekomtz1/Full-Stack_Projects.git
   cd 01-ChatApp
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Build the frontend:
   ```bash
   npm run build
   ```

## Usage

To run the Chat App:

- Start the backend server:
  ```bash
  npm run server
  ```

- For a production environment, simply start the server with:
  ```bash
  npm start
  ```

Access the live application here: [Chat App Live](https://zero1-chatapp.onrender.com)

### Test Accounts
You can log in to the application using the following test credentials to explore and test all functionalities:

- Username: johndoe | Password: 123456
- Username: michaeldoe | Password: 123456
- Username: daisydoe | Password: 123456
- Username: lucydoe | Password: 123456
- Username: bobdoe | Password: 123456

Feel free to interact with the application and check the conversations already in place among some of the participants to see the chat functionality in action.

## Features

- **Real-time Messaging:** Utilize Socket.io to enable real-time interactions between users.
- **Authentication and Authorization:** Securely manage user access and data with JWT.
- **Online User Status:** Show user status dynamically using Socket.io and React Context.
- **Global State Management:** Zustand is used for managing state across the application.
- **Error Handling:** Implement robust error handling on both the server and client sides.
- **Stylish UI:** Use TailwindCSS and Daisy UI for a responsive and modern user interface.

## Screenshots
![Login/Signup Screeenshot](https://i.imgur.com/oJMBmU1.png)
![Chat Screeenshot](https://i.imgur.com/YQ9ig7i.png)
![Conversation Banner](https://i.imgur.com/KROSlgd.png)

## Dependencies

- `bcryptjs`
- `cookie-parser`
- `dotenv`
- `express`
- `jsonwebtoken`
- `mongoose`
- `socket.io`

## Configuration

Ensure to configure the necessary environment variables in a `.env` file in the root directory:
- `MONGO_DB_URI`
- `JWT_SECRET`
- `NODE_ENV`

## Documentation

For further documentation on each package used within the project, visit the following links:

- [Express](https://expressjs.com/)
- [Socket.io](https://socket.io/)
- [Mongoose](https://mongoosejs.com/)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [Zustand](https://github.com/pmndrs/zustand)

## Contributors

Feel free to contribute to the development of 01-chatapp. If interested, please see the instructions on how to do so in the CONTRIBUTING.md file.

## License

This project is licensed under the [ISC License](https://opensource.org/license/isc-license-txt).
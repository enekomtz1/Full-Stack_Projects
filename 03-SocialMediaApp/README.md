# Threads App with Real-Time Chat Functionality

![Threads App Banner](https://i.imgur.com/ZE7D1XY.png)

## Table of Contents

-   [Introduction](#introduction)
-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Installation](#installation)
    -   [Prerequisites](#prerequisites)
    -   [Setting Up Environment Variables](#setting-up-environment-variables)
    -   [Building the Application](#building-the-application)
    -   [Starting the Application](#starting-the-application)
-   [Usage](#usage)
-   [Documentation](#documentation)
-   [Contributors](#contributors)
-   [License](#license)

## Introduction

Threads App is a dynamic real-time chat application that offers a robust set of features aimed at enhancing user interaction and engagement. This demo app allows users to manage posts, comments, and follows, incorporates authentication, and supports both light and dark themes for a personalized user experience.

## Features

-   **Authentication & Authorization with JWT**: Securely manage user sessions.
-   **Create, Delete Posts**: Users can add and remove posts.
-   **Like/Unlike Posts**: Interactive feature for liking and unliking posts.
-   **Comment on Posts**: Allows users to comment on different posts.
-   **Follow/Unfollow Users**: Manage user relationships.
-   **Account Freeze**: Users can freeze their accounts temporarily.
-   **Dark/Light Mode**: Users can switch between themes.
-   **Responsive Design**: Fully responsive, ensuring a smooth experience on all devices.
-   **Real-Time Chat with Image Support**: Chat system that supports text and images.
-   **Message Status (Seen/Unseen)**: Keeps track of message delivery and reading status.
-   **Notification Sounds**: Alerts for new messages and other notifications.
-   **Free Deployment**: Guidance on deploying the app at no cost.

## Tech Stack

-   **MERN (MongoDB, Express.js, React.js, Node.js)**
-   **Socket.io**: For real-time communication.
-   **Chakra UI**: For styling and responsive design.

## Installation

### Prerequisites

-   Node.js
-   MongoDB
-   Cloudinary account for image handling

### Setting Up Environment Variables

Create a `.env` file in your project root and update it with your details:

```plaintext
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Building the Application

Run the following command to build the application:

```bash
npm run build
```

### Starting the Application

To start the app, run:

```bash
npm start
```

## Usage

After starting the app, you can access it by navigating to `http://localhost:{PORT}` in your web browser. Ensure your MongoDB and any other service configurations are correctly set up.

## Documentation
For detailed documentation on the various technologies and frameworks utilized in the Threads App, refer to the following resources:

- **MERN (MongoDB, Express.js, React.js, Node.js)**:
  - **MongoDB**: [MongoDB Documentation](https://docs.mongodb.com)
  - **Express.js**: [Express Documentation](https://expressjs.com)
  - **React.js**: [React Documentation](https://reactjs.org/docs/getting-started.html)
  - **Node.js**: [Node.js Documentation](https://nodejs.org/en/docs/)

- **Socket.io**:
  - Comprehensive documentation for real-time communication can be found at [Socket.io Documentation](https://socket.io/docs/).

- **Chakra UI**:
  - For styling and responsive design guidelines, refer to the [Chakra UI Documentation](https://chakra-ui.com/docs/getting-started).

## Contributors
- [enekomtz1](https://github.com/enekomtz1)

## License

This project is licensed under the [ISC License](https://opensource.org/license/isc-license-txt).

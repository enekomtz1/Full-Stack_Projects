# Real-Time Chat App (MERN Stack)

![Chat App Banner](https://i.imgur.com/OOHKIvG.png)

## Table of Contents

-   [Introduction](#introduction)
-   [Features](#features)
-   [Technologies](#technologies)
-   [Setup](#setup)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Environment Variables](#environment-variables)
-   [Usage](#usage)
-   [Building the Application](#building-the-application)
-   [License](#license)

## Introduction

This project is a real-time chat application built using the MERN stack (MongoDB, Express.js, React, Node.js), integrated with Socket.io for real-time communication, and styled with TailwindCSS and Daisy UI. The application features authentication and authorization using JWT, online user status updates, and global state management using Zustand.

## Features

-   **Tech Stack**: MERN + Socket.io + TailwindCSS + Daisy UI
-   **Authentication & Authorization**: Secure user authentication and authorization using JWT.
-   **Real-time Messaging**: Instant communication with Socket.io.
-   **User Status**: Online user status updates using Socket.io and React Context.
-   **State Management**: Global state management with Zustand.
-   **Error Handling**: Robust error handling on both the server and the client.

## Technologies

-   Node.js
-   Express.js
-   React
-   MongoDB
-   Socket.io
-   JWT for authentication
-   Zustand for state management
-   TailwindCSS + Daisy UI for styling

## Setup

### Prerequisites

-   Node.js installed
-   MongoDB account and database
-   npm or yarn as package managers

### Installation

To set up the application on your local machine, follow these steps:

```bash
git clone https://github.com/your-repository/01-chatapp.git
cd 01-chatapp
npm install
```

### Environment Variables

Create a `.env` file in your project root and add the following variables:

```plaintext
PORT=your_port_number
MONGO_DB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development or production
```

## Usage

To start the application, run:

```bash
npm start
```

## Building the Application

To build the application for production, use:

```bash
npm run build
```

## License

This project is licensed under the [ISC License](https://opensource.org/license/isc-license-txt).

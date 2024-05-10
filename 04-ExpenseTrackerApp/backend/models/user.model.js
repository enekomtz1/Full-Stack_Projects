/*
- This code defines a Mongoose schema for a User model in a MongoDB database.
- It specifies various fields like username, name, password, profilePicture, and gender.
- Each field is defined with specific data types and constraints, such as 'required' and 'unique'.
- The 'profilePicture' field has a default value of an empty string if not provided.
- Timestamps are automatically added to each document, recording creation and update times.
*/

import mongoose from "mongoose"; // Import Mongoose to interact with MongoDB.

// Define the schema for the User model with specific attributes and constraints.

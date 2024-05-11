/*
- This code configures Passport.js authentication strategies for a GraphQL server.
- It includes serialization and deserialization methods to manage user sessions.
- A custom local strategy is used to authenticate users based on username and password.
- Error handling is integrated to manage incorrect username or password inputs securely.
- Bcrypt.js is utilized to safely compare hashed passwords.
*/

import passport from "passport"; // Import passport for authentication handling
import bcrypt from "bcryptjs"; // Import bcryptjs for password hashing and verification

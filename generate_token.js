import jwt from "jsonwebtoken";

// User 18 data
const user = {
  id: 18,
  email: "1111111111@gmail.com",
  name: "111",
};

// JWT secret (same as in backend)
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Generate token
const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });

console.log("User 18 JWT Token:");
console.log(token);

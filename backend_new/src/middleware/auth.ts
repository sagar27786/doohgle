import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface AuthUser {
  id: number;
  email: string;
  roles?: string[];
}

export function authMiddleware(
  req: Request & { user?: AuthUser },
  res: Response,
  next: NextFunction
) {
  const header = req.headers["authorization"] || "";
  console.log("the header is : " ,header);
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  console.log("the token is : " ,token);
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  // Temporary bypass for testing venue owner functionality
  // if (token === 'temp-venue-owner-token-user-1') {
  //   req.user = {
  //     id: 1,
  //     email: 'venue1@test.com',
  //     roles: ['venue_owner']
  //   };
  //   return next();
  // }

  // if (token === 'temp-venue-owner-token-user-3') {
  //   req.user = {
  //     id: 3,
  //     email: 'venue3@test.com',
  //     roles: ['venue_owner']
  //   };
  //   return next();
  // }

  // if (token === 'temp-venue-owner-token-user-4') {
  //   req.user = {
  //     id: 4,
  //     email: 'venue4@test.com',
  //     roles: ['venue_owner']
  //   };
  //   return next();
  // }

  try {
    console.log("before decoded");
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    console.log("after decoded");
    req.user = decoded;
    return next();
  } catch (e) {
    console.log("the main error is : " ,e);
    return res.status(401).json({ message: "Invalid token" });
  }
}
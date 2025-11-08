import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth.util";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access token missing" });
  }

  const token = authHeader.split(" ")[1];
console.log(token)
  try {
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET as string);
console.log(decoded);
  
    ( req as any).user = { id: decoded.id };
    
    next();
  } catch (err) {
     console.error("Auth error:", err);
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
};

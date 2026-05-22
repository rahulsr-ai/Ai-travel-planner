import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ message: 'Not authorized, token missing' });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    
    // Request object mein user data attach kar rahe hain
    req.user = { id: decoded.id };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
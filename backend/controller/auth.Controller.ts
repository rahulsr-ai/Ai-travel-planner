import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '.././models/User.schema'; // .js extension NodeNext resolution ke liye zaroori hai

const generateToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '1d',
    });
};



// Register New user
export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: 'Please add all fields' });
            return;
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json(
                {
                    message: "User Register Successfully",
                    data: {
                        _id: user.id,
                        name: user.name,
                        email: user.email,
                        token: generateToken(user.id),
                    }
                });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Authenticate a user
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                message: "Login Successfully",
                data: {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user.id),
                }

            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
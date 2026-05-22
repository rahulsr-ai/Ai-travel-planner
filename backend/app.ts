import dotenv from 'dotenv'
dotenv.config();;

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.Route';
import itineraryRoute from './routes/itinerary.Route';
import connectDB from './config/db';


// Database Connection 
connectDB()


const app = express();

app.use(cors({ 
    // origin: ['https://tripaxis.netlify.app', "http://localhost:5173"],
    origin: ['https://tripaxis.netlify.app'],
    credentials: true
}));


app.use(express.json());


app.get('/', (req, res) => {
    return res.json({ message: 'All Good ' }).status(200)
})

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/itinerary', itineraryRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
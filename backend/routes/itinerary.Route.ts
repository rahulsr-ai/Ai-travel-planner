import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { generateItinerary, getSharedItinerary, getUserHistory } from '../controller/itinerary.Controller';

const router = Router();

// 1. Generate: File upload and create itinerary  (Protected)
router.post('/generate', protect, upload.single('file'), generateItinerary);

// History: User saved plans  (Protected)
router.get('/history', protect, getUserHistory);

// 3. Share: share user itinerary with public link (Public)
router.get('/shared/:id', getSharedItinerary);

export default router;
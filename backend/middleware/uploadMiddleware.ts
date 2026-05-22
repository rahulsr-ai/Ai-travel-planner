import multer from 'multer';


const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype.startsWith('image/')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only PDFs and Images are allowed!'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Max 5MB file size
  },
  fileFilter: fileFilter
});
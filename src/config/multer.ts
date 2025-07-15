import multer from "multer";
const storage = multer.memoryStorage(); // store image in memory

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Set file size limit (5MB in this example)
});

export default upload;

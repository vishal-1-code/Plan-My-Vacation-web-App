import multer from "multer";
const storage =  multer.memoryStorage()
export const multipleUpload = multer( { storage:storage}).fields([
    { name: 'profilePhoto',maxCount:1},
    { name: 'Images',maxCount: 10 }
  ]); 


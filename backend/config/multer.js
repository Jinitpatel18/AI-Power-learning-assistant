import multer from "multer";
import path from 'path';
import { fileURLToPath } from "url";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CHANGE THIS LINE - Use /tmp on Vercel, local directory otherwise
const uploadDir = process.env.VERCEL 
    ? '/tmp/uploads/documents'
    : path.join(__dirname, '../uploads/documents');

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true});
}

//configure store
const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {  // ✅ CHANGE 'res' to 'req'
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`)  // ✅ REMOVE SPACE (optional but recommended)
    }
})

const fileFilter = ( req, file, cb) => {
    if(file.mimetype === "application/pdf"){
        cb(null, true)
    }else{
        cb(new Error('Only PDF files are allowed!'),false)  // ✅ FIX TYPO: "a allowed" → "allowed"
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10 MB default
    }
})

export default upload;
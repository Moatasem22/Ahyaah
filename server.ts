import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// In-memory "database" for file metadata (could be Firestore)
let filesMetadata: any[] = [];

// API Routes
app.post('/api/upload', upload.array('files'), (req, res) => {
  try {
    const uploadedFiles = (req.files as Express.Multer.File[]).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.originalname,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      url: `/uploads/${file.filename}`,
      type: file.mimetype,
      date: new Date().toISOString()
    }));

    filesMetadata = [...filesMetadata, ...uploadedFiles];
    res.status(200).json({ success: true, files: uploadedFiles });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

app.get('/api/files', (req, res) => {
  console.log(`Fetching metadata for ${filesMetadata.length} files`);
  res.status(200).json({
    success: true,
    count: filesMetadata.length,
    data: filesMetadata
  });
});

// Vite middleware for development
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

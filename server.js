const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });
const app = express();

// Serve client files
app.use(express.static('public'));

// Serve uploaded images
app.use('/saved', express.static(path.join(__dirname, 'saved')));

// Upload endpoint
app.post('/upload-photo', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const dest = path.join(__dirname, 'saved', `${Date.now()}-${req.file.originalname}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  fs.rename(req.file.path, dest, err => {
    if (err) return res.status(500).json({ error: 'Save failed' });

    console.log('Saved', dest);

    const photoUrl = `/saved/${path.basename(dest)}`;
    res.json({ message: 'Photo received', url: photoUrl });
  });
});

// CORS for cross-origin requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

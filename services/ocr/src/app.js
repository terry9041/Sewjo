const express = require('express');
const multer = require('multer');
const path = require('path');
const { processFile } = require('./ocrSpaceProcessor/ocrSpaceProcessor'); // Adjust the path as needed

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.render('index'); 
});

app.post('/upload', upload.single('test'), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded.' });
      }
      const parsedData = await processFile(req.file.path, res);
      if (parsedData) {
          res.json({ success: true, data: parsedData });
      } else {
          res.status(500).json({ error: 'Failed to process the image. Please try again with a clearer image.' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred during processing' });
  }
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
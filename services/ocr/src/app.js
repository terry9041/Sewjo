const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const multer = require('multer');
const { processFile } = require('./ocrSpaceProcessor/ocrSpaceProcessor');

const app = express();

// Ensure the uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Save the file with its original name
    }
});

// Multer upload configuration
const upload = multer({ storage: storage }).single('test');

// Set the view engine to EJS and configure the views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/upload', (req, res) => {
    upload(req, res, async err => {
        console.log(req.file);
        if (err) {
            console.log('This is your error', err);
            return;
        }
        
        if (!req.file) {
            res.send('Please upload a file');
            return;
        }

        const OCRText = await processFile(req.file.path, res);
        console.log('OCR Text: ', OCRText);
        res.send(OCRText);
    });
});
// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
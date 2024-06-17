const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser');

const app = express();

// used to read and create files
const fs = require('fs');
// used to upload files to server
const multer = require('multer');

const {processFile} = require('./tesseractProcessor/tesseractProcessor')

// Ensure the uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// this is where we save the images uploaded
const storage = multer.diskStorage({
    // req = request, res = response, cb = callback
    destination: (req,file,cb) => {
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Save the file with its original name
    }
})

// when upload is called it runs everything in storage
// .single will store file in req.file
const upload = multer({storage: storage}).single("test");
//ejs lets you write html and combine with all the backend logic here
app.set("view engine", "ejs");

// routes
app.get('/', (req,res) => {
    res.render('index');
});

app.post('/upload', (req,res) => {
    upload(req,res, err => {
        console.log(req.file);
        fs.readFile("./uploads/" + req.file.originalname, async (err,data) => {
            if (err) return console.log('This is your error', err);

            const OCRText = await processFile(req.file.path, res);
            //res.send(OCRText);
            console.log(OCRText);
        });
    });
});

// start up the server
const port = process.env.PORT || 8000;
app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
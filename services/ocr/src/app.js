const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser');

const app = express();

// used to readd and create files
const fs = require('fs');
// used to upload files to server
const multer = require('multer');
// this will read the images
const { createWorker } = require('tesseract.js');
// this will analyze the images
let worker;
async function initializeWorker() {
    worker = await createWorker();
}
initializeWorker();
//const worker = createWorker();

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

            const { data: { text } } = await worker.recognize(data, "eng");
                console.log('OCR result:', text);
                res.send(text);
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
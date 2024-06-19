// used to read and create files
const fs = require('fs');
// this will read the images
const { createWorker } = require('tesseract.js');
// this will analyze the images
let worker;
async function initializeWorker() {
    worker = await createWorker();
}
initializeWorker();
//const worker = createWorker();

/**
 * This function will process the image and delete the image after
 * @param {*} filePath 
 * @param {*} res 
 * @returns text from the image
 */
async function processFile(filePath, res) {
    try {
        const data = fs.readFileSync(filePath);
        const {data:{text}} = await worker.recognize(data, 'eng');
        return text;
    } catch (error) {
        console.log('Error during OCR processing: ', error);
        res.status(500).send('Error during OCR processing.');
    } finally {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file: ', err);
            } else {
                console.log('Successfully deleted ' + filePath);
            }
        });
    }
}

module.exports = {processFile};
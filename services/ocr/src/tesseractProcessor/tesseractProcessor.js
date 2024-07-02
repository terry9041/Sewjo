const fs = require('fs');
const { createWorker } = require('tesseract.js');
const {makeImageUpright} = require('../imageRotator/imageRotator')
const sharp = require('sharp');
// this will analyze the images
let worker;
async function initializeWorker() {
    worker = await createWorker('eng', 0, {
        legacyCore: true, 
        legacyLang: true
    });
}
initializeWorker();
//const worker = createWorker();

/**
 * Resize an image buffer using sharp.
 * @param {Buffer} imageBuffer - The image buffer to resize.
 * @param {Object} options - Resize options for sharp.
 * @returns {Promise<Buffer>} Resized image buffer.
 */
async function resizeImage(imageBuffer, options) {
    const resizedImageBuffer = await sharp(imageBuffer)
        .resize(options)
        .toBuffer();
    
    return resizedImageBuffer;
}

/**
 * Process an image file, perform OCR, and delete the file afterward.
 * @param {string} filePath - Path to the image file to process.
 * @param {Object} res - Express response object for handling errors.
 * @returns {Promise<string>} Text extracted from the image.
 */
async function processFile(filePath, res) {
    try {
        let file = fs.readFileSync(filePath);
        
        // Resize image if needed
        file = await resizeImage(file, { width: 2000 }); // Adjust options as needed

        // Detect orientation and process image if needed
        const { data } = await worker.detect(file);
        if (data["orientation_degrees"] !== 0) {
            file = await makeImageUpright(filePath, data["orientation_degrees"]);
        }
        
        // Perform OCR using Tesseract
        const { data: { text } } = await worker.recognize(file, 'eng');
        
        return text;
    } catch (error) {
        console.error('Error during OCR processing: ', error);
        res.status(500).send('Error during OCR processing.');
    } finally {
        // Delete the file after processing
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file: ', err);
            } else {
                console.log('Successfully deleted ' + filePath);
            }
        });
    }
}

module.exports = { processFile };

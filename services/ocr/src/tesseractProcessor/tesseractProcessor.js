const fs = require('fs');
const { createWorker } = require('tesseract.js');
const { makeImageUpright } = require('../imageRotator/imageRotator');
const sharp = require('sharp');

// Initialize the worker
let worker;
async function initializeWorker() {
    worker = await createWorker('eng+fra', 0, {
        legacyCore: true, 
        legacyLang: true
    });
    await worker.setParameters({
        tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-,()',
        preserve_interword_spaces: '1'
    });
}
initializeWorker();

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
 * Enhance an image buffer using sharp.
 * @param {Buffer} imageBuffer - The image buffer to enhance.
 * @returns {Promise<Buffer>} Enhanced image buffer.
 */
async function enhanceImage(imageBuffer) {
    const enhancedImageBuffer = await sharp(imageBuffer)
        .grayscale()
        .modulate({
            brightness: 1,
            saturation: 1,
            hue: 0
        })
        .sharpen({
            sigma: 6.8,  
            m1: 2.69,    
            m2: 0        
        })
        .toBuffer();
        
        sharp(enhancedImageBuffer).toFile('./uploads/enhanced.jpg');
        
    return enhancedImageBuffer;
}


const convertImage = (imageSrc) => {
    const data = atob(imageSrc.split(',')[1])
          .split('')
          .map((c) => c.charCodeAt(0));
  
    return new Uint8Array(data);
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
        
        file = await resizeImage(file, { width: 2000 });
        // file = await enhanceImage(file);

        // const { data } = await worker.detect(file);

        // if (data.orientation_degrees !== 0) {
        //     file = await makeImageUpright(filePath, data.orientation_degrees);
        // }
        
        // const { data: { text } } = await worker.recognize(file, {rotateAuto: true}, {imageColor: true, imageGrey: true, imageBinary: true});

        const { data: { text} } = await worker.recognize(file, {rotateAuto: true}, {imageColor: true, imageGrey: true, imageBinary: true});
  
        console.log('Saving intermediate images: imageColor.png, imageGrey.png, imageBinary.png');

        //fs.writeFileSync('./uploads/imageColor.png', convertImage(imageColor));
        //fs.writeFileSync('./uploads/imageGrey.png', convertImage(imageGrey));
        //fs.writeFileSync('./uploads/imageBinary.png', convertImage(imageBinary));
        
        return text;
    } catch (error) {
        console.error('Error during OCR processing: ', error);
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

module.exports = { processFile };

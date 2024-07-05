const fs = require('fs');
const { ocrSpace } = require('ocr-space-api-wrapper');
const sharp = require('sharp');
const enhancedImagePath = './uploads/enhanced.jpg';
const ocrKey = process.env.OCRSPACEKEY;


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

    sharp(enhancedImageBuffer).toFile(enhancedImagePath);

    return enhancedImageBuffer;
}

async function processFile(filePath, res) {
    try {

        await enhanceImage(filePath);

        // Using the OCR.space default free API key (max 10reqs in 10mins) + remote file
        // const res1 = await ocrSpace('http://dl.a9t9.com/ocrbenchmark/eng.png');

        // Using your personal API key + local file
        // const res2 = await ocrSpace('/path/to/file.pdf', { apiKey: <apikey> });

        // Using your personal API key + base64 image + custom language
        const res = await ocrSpace(enhancedImagePath, { apiKey: ocrKey, language: 'eng', OCREngine: 2 });
        //console.log(res);
        return res.ParsedResults;
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
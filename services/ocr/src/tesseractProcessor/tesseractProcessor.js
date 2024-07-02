// used to read and create files
const fs = require('fs');
// this will read the images
const { createWorker } = require('tesseract.js');

const {makeImageUpright} = require('../imageRotator/imageRotator')
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
 * This function will process the image and delete the image after
 * @param {*} filePath 
 * @param {*} res 
 * @returns text from the image
 */
async function processFile(filePath, res) {
    try {
        let file = fs.readFileSync(filePath);
        //console.log(file);
        // this is give you the orientation of the file, along with confidence score
        // which can be used for screening images
        const {data} = await worker.detect(file);
        //console.log(data);
        // if picture is not upright, then will make upright
        if (data["orientation_degrees"] != 0) {
            try {
                file = await makeImageUpright(filePath, data["orientation_degrees"]);
                //console.log(file);
            } catch (error) {
                console.error('Error processing image: ', error);
            }
        }
        const {data:{text}} = await worker.recognize(file, 'eng');
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
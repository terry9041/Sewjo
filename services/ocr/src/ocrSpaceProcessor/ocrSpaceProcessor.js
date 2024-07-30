const fs = require('fs');
const { ocrSpace } = require('ocr-space-api-wrapper');
const sharp = require('sharp');
const enhancedImagePath = './uploads/enhanced.jpg';
const ocrKey = process.env.OCRSPACEKEY;

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



function parseMeasurements(parsedText) {
    if (!parsedText) {
        console.error('No parsed text available');
        return null;
    }

    const lines = parsedText.split('\n');
    
    const patternSizes = {
        combinations: lines[0],
        jacket: {
            fabric45: [],
            fabric60: [],
            fusibleKnitInterfacing: [],
            widthLowerEdge: [],
            backLength: []
        },
        pants: {
            fabric45: [],
            fabric60: [],
            fusibleKnitInterfacing: [],
            widthEachLeg: [],
            sideLengthFromWaist: ''
        },
        jacketAndPants: {
            fabric45: [],
            fabric60: [],
            fusibleKnitInterfacing: []
        },
        lining: {
            fabric45: []
        },
        raw: parsedText
    };

    let currentSection = '';

    lines.forEach(line => {
        if (line.includes('JACKET') && !line.includes('AND PANTS')) currentSection = 'jacket';
        else if (line.includes('PANTS') && !line.includes('JACKET AND')) currentSection = 'pants';
        else if (line.includes('JACKET AND PANTS')) currentSection = 'jacketAndPants';
        else if (line.includes('LINING')) currentSection = 'lining';
        else if (line.includes('Width, lower edge')) currentSection = 'jacketWidth';
        else if (line.includes('Width, each leg')) currentSection = 'pantsWidth';
        else if (line.includes('Back length from base of your neck')) currentSection = 'jacketBackLength';
        else if (line.includes('Side length from waist')) currentSection = 'pantsSideLength';
        else {
            const values = line.split(/\s+/).filter(v => v.trim());
            if (values.length >= 3) {
                switch(currentSection) {
                    case 'jacket':
                        if (patternSizes.jacket.fabric45.length === 0) patternSizes.jacket.fabric45 = values;
                        else if (patternSizes.jacket.fabric60.length === 0) patternSizes.jacket.fabric60 = values;
                        else if (patternSizes.jacket.fusibleKnitInterfacing.length === 0) patternSizes.jacket.fusibleKnitInterfacing = values;
                        break;
                    case 'pants':
                        if (patternSizes.pants.fabric45.length === 0) patternSizes.pants.fabric45 = values;
                        else if (patternSizes.pants.fabric60.length === 0) patternSizes.pants.fabric60 = values;
                        else if (patternSizes.pants.fusibleKnitInterfacing.length === 0) patternSizes.pants.fusibleKnitInterfacing = values;
                        break;
                    case 'jacketAndPants':
                        if (patternSizes.jacketAndPants.fabric45.length === 0) patternSizes.jacketAndPants.fabric45 = values;
                        else if (patternSizes.jacketAndPants.fabric60.length === 0) patternSizes.jacketAndPants.fabric60 = values;
                        else if (patternSizes.jacketAndPants.fusibleKnitInterfacing.length === 0) patternSizes.jacketAndPants.fusibleKnitInterfacing = values;
                        break;
                    case 'lining':
                        if (patternSizes.lining.fabric45.length === 0) patternSizes.lining.fabric45 = values;
                        break;
                    case 'jacketWidth':
                        patternSizes.jacket.widthLowerEdge = values;
                        break;
                    case 'pantsWidth':
                        patternSizes.pants.widthEachLeg = values;
                        break;
                    case 'jacketBackLength':
                        patternSizes.jacket.backLength = values;
                        break;
                }
            } else if (currentSection === 'pantsSideLength') {
                patternSizes.pants.sideLengthFromWaist = values[0];
            }
        }
    });

    return patternSizes;
}

function textCleaner(string) {
    return string.replace("S", "5")
                 .replace("O", "0")
                 .replace("%", "½")
                 .replace(/[^0-9⅐-⅞]/g, "0");
}

async function processFile(filePath, res) {
    try {

        const ocrResult = await ocrSpace(filePath,
            {
                apiKey: ocrKey,
                language: 'eng',
                OCREngine: 2,
                isTable: true,
                detectOrientation: true,
                isOverlayRequired: false
            });
        
        if (!ocrResult || !ocrResult.ParsedResults || ocrResult.ParsedResults.length === 0) {
            console.error('OCR processing failed or returned no results');
            return null;
        }

        // fs.writeFileSync('./uploads/ocrData.json', JSON.stringify(ocrResult));

        // //using dummy json
        // const ocrResult = JSON.parse(fs.readFileSync('./ocrData.json', 'utf8'));

        const parsedText = ocrResult.ParsedResults[0].ParsedText;

        const parsedData = parseMeasurements(parsedText);
        return parsedData;
    } catch (error) {
        console.error('Error during OCR processing: ', error);
        throw error; 
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
const sharp = require("sharp");
const fs = require("fs");
const outputPath = './uploads';

/**
 * This function will rotate and image upright
 * @param {*} filePath path to image
 * @param {*} currentDegrees current angle of image
 * @returns image buffer of rotated image
 */
function makeImageUpright(filePath, currentDegrees) {
    try {
        const newBuffer = sharp(filePath)
            .rotate(currentDegrees)
            .toBuffer();
        return newBuffer;
    } catch (error) {
        console.error('makeImageUpright: ', error);
    }
}

module.exports = { makeImageUpright };
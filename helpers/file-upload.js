const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
// const multerSharp = require('multer-s3');
const stringGen = require('otp-generator');
const config = require('../config/env');

// Use our env vars for setting credentials.
cloudinary.config({
  cloud_name: config.cloudinary.cloud,
  api_key: config.cloudinary.accessKeyId,
  api_secret: config.cloudinary.secretAccessKey,
});

/**
 * - This function extracts user avatar and stores it as oldAvatar,
 * a placeholder until update is complete, if error, it can be used to revert process
 * @param {{}} req - Request object
 * @param {string} folder - folder to store image
 */
function getPreviousAvatar(req, folder) {
  //check if user has an avatar, set it to old
  if (req.user.avatar && folder === 'avatar') {
    const urlArray = req.user.avatar.split('/');
    req.oldAvatar = urlArray.includes(folder) ? `${urlArray[urlArray.length - 2]}/${urlArray[urlArray.length - 1]}` : ''; // get name of old avatar to automate delete purpose
  }
}
// /**
//  * Function returns middleware for uplaod
//  * @param {string} folder - space storage folder for file
//  */
function upload(folder) {
  //   // Change bucket props to your file storage space name
  return multer({
    storage: cloudinaryStorage({
      cloudinary: cloudinary,
      allowedFormats: ['jpg', 'png'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
      filename(req, file, cb) {
        // get previous filename from image url
        getPreviousAvatar(req, folder);
        req.cloudinary = cloudinary; // add s3 to request body for error handling
        let stringVal = stringGen.generate(Math.ceil(Math.random() * 30), { specialChars: false }).toString();
        let imageName = `${folder}-${req.user.id.slice(2, 8)}-${stringVal}-${Date.now()}`; // create file name if avatar never exist
        cb(null, `${folder}/${imageName}`); // store image in avatar folder on DO space
      },
    }),
    // filter input files, must be jpg, jpeg, or png else rejection is done
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg|jpeg)$/i)) {
        return cb(new Error('File must be jpg, jpeg or png'));
      }
      cb(undefined, true);
    },
    limits: {
      fileSize: 5000000, // file size to be uploaded must be less than 5mb
    },
  });
}

module.exports = upload;

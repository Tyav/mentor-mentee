const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_BUCKET_NAME } = require('../config/env');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint('sfo2.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  Bucket: AWS_BUCKET_NAME
});

const multerS3Config = multerS3({
  s3: s3,
  bucket: AWS_BUCKET_NAME,
  acl: 'public-read', // to allow acces to image
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: (req, file, callback) => {
    callback(null, { fieldName: file.fieldname });
  },
  key: (req, file, callback) => {
    callback(null, `${req.userID}-${Date.now()}${file.originalname}`); // Key is the filename
  }
});

function checkFileType(file, callback) {
  const filetypes = /jpeg|jpg|png|gif/gi; //permited extensions
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    return callback(null, true);
  } else {
    return callback('Error: Images Only!');
  }
}

const upload = multer({
  storage: multerS3Config,
  fileFilter: (req, file, callback) => {
    checkFileType(file, callback);
  },
  limits: {
    fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
  }
}).single('profilePicture');

exports.profileImage = upload;

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
} = require('@aws-sdk/client-s3');
const fs = require('fs');

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  accessKeyId,
  secretAccessKey,
  region,
});
exports.s3Client = s3Client;

async function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);
  console.log(file);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };
  const data = await s3Client.send(new PutObjectCommand(uploadParams));
  return data;
}
exports.uploadFile = uploadFile;

async function getFileStream(fileKey) {
  const downloadParams = {
    Bucket: bucketName,
    Key: fileKey,
  };

  return s3Client.send(new GetObjectCommand(downloadParams));
}
exports.getFileStream = getFileStream;

async function getAllPhotos() {
  const getAllParams = {
    Bucket: bucketName,
  };

  return s3Client.send(new ListObjectsCommand(getAllParams));
}
exports.getAllPhotos = getAllPhotos;

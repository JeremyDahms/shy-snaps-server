const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
});
exports.s3Client = s3Client;

async function uploadFile(file) {
  const uploadParams = {
    Bucket: bucketName,
    Key: file.key,
    Body: file.buffer,
    ContentType: file.mimetype,
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

async function getImageUrl(fileKey) {
  const downloadParams = {
    Bucket: bucketName,
    Key: fileKey,
  };
  const command = new GetObjectCommand(downloadParams);
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
}
exports.getImageUrl = getImageUrl;

async function getAllPhotos() {
  const getAllParams = {
    Bucket: bucketName,
  };

  return s3Client.send(new ListObjectsCommand(getAllParams));
}

exports.getAllPhotos = getAllPhotos;

async function getImage(imageKey) {
  const streamToString = (stream) =>
    new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  try {
    const { Body } = await s3Client.send(
      new GetObjectCommand({ Bucket: bucketName, Key: imageKey })
    );

    return await streamToString(Body);
  } catch (err) {
    console.log('Error', err);
  }
}

exports.getImage = getImage;

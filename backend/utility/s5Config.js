// s3Config.js
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  httpOptions: {
    timeout: 300000, // 5-minute timeout for idle connections
  },
});

export const uploadToS3 = async (fileBuffer, bucketName, key,mimeType) => {
  // const fs = await import('fs').then((module) => module.promises);

  try {
    // const fileContent = await fs.readFile(filePath); // Read the file as buffer
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType, // Assuming PDF files
    };
    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Location; //Return the file URL
  } catch (error) {
    console.error('Error uploading to S3:', error.message);
    throw new Error('Failed to upload file to S3');
  }
};

export const getS3File = async (bucketName, key) => {

  try{
    const params = { Bucket: bucketName, Key: key ,Expires : 3600 };
     
    const url = await s3.getSignedUrlPromise('getObject', params); // Generate a signed URL for reading the file
    console.log("Signend URl",url);
    return url;
  } catch(error){
    console.error("Error generation S2 Url :",error.message);
    throw new Error("Failed to generated signed URL");
  }
};

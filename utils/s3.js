require('dotenv').config('../');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION // e.g., 'us-west-1'
});

// const params = {
//     Bucket: 'tixarfs', // Name of your S3 bucket
//     Key: 'test-upload.txt',    // Desired file name in S3. This can be a path like 'folder/filename.txt'
//     Body: 'Hello from Node.js!',  // Content of the file
// };

// s3.putObject(params, function(err, data) {
//     if (err) {
//         console.error("Error", err);
//     } else {
//         console.log("Successfully uploaded data to", params.Bucket + '/' + params.Key);
//     }
// });

module.exports = s3;

const express = require('express');
const multer = require('multer');
const aws = require('aws-sdk');
const path = require('path');

const app = express();
const port = 3001; 

// Configure AWS SDK
const s3 = new aws.S3({
    region: 'ap-southeast-1'  // Replace with your actual bucket's region if different 
});

// Set up Multer for file upload handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve the HTML frontend
app.use(express.static(path.join(__dirname, 'public')));

// Route for uploading files
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        console.error('No file uploaded');
        return res.status(400).send('No file uploaded');
    }

    const params = {
        Bucket: '<bucket_name>',  // Your S3 bucket name
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error('Error uploading to S3:', err);
            return res.status(500).send('Failed to upload to S3');
        }
        res.send(`File uploaded successfully: ${data.Location}`);
    });
});

// Route for listing files in the bucket
app.get('/files', (req, res) => {
    const params = {
        Bucket: '<buckey_name>'  // Your S3 bucket name
    };

    s3.listObjectsV2(params, (err, data) => {
        if (err) {
            console.error('Error listing objects in S3:', err);
            return res.status(500).send('Failed to retrieve files');
        }
        
        // Debugging output to check if files are retrieved
        console.log('S3 listObjectsV2 response:', data);

        if (data && data.Contents) {
            // Map to only return file names
            const files = data.Contents.map((item) => item.Key);
            res.json(files);
        } else {
            res.json([]);  // Return an empty list if there are no files
        }
    });
});

// Route for downloading files
app.get('/download/:filename', (req, res) => {
    const params = {
        Bucket: '<bucket_name>',  // Your S3 bucket name
        Key: req.params.filename
    };

    s3.getObject(params, (err, data) => {
        if (err) {
            console.error('Error fetching from S3:', err);
            return res.status(500).send('Failed to download from S3');
        }
        res.setHeader('Content-Disposition', `attachment; filename=${req.params.filename}`);
        res.send(data.Body);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

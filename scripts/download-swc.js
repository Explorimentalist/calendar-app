const fs = require('fs');
const https = require('https');
const path = require('path');

// Update the URL to point to the actual SWC binary URL
const fileUrl = 'https://registry.npmjs.org/@next/swc-darwin-arm64/-/swc-darwin-arm64-14.2.14.tgz';
const outputDir = path.join(__dirname, '../node_modules/@next/swc-darwin-arm64');
const outputPath = path.join(outputDir, 'next-swc.darwin-arm64.node');

// Create directory if it doesn't exist
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Function to download the file
const downloadFile = (url, outputPath) => {
    ensureDirectoryExists(path.dirname(outputPath));
    
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
            // Handle redirect
            downloadFile(response.headers.location, outputPath);
            return;
        }
        
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log('Download completed:', outputPath);
        });
    }).on('error', (err) => {
        fs.unlink(outputPath, () => {}); // Delete the file if there's an error
        console.error('Error downloading file:', err.message);
    });
};

// Execute the download
try {
    downloadFile(fileUrl, outputPath);
} catch (error) {
    console.error('Error:', error);
    process.exit(1);
}

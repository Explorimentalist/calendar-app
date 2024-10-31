const fs = require('fs');
const https = require('https');
const path = require('path');

// URL del archivo que deseas descargar
const fileUrl = '../node_modules/@next/swc-darwin-arm64/next-swc.darwin-arm64.node'; // Cambia esto a la URL real
const outputPath = path.join(__dirname, '../node_modules/@next/swc-darwin-arm64/next-swc.darwin-arm64.node');

// Función para descargar el archivo
const downloadFile = (url, outputPath) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log('Descarga completada:', outputPath);
        });
    }).on('error', (err) => {
        fs.unlink(outputPath); // Elimina el archivo si hay un error
        console.error('Error al descargar el archivo:', err.message);
    });
};

// Ejecutar la descarga
downloadFile(fileUrl, outputPath);

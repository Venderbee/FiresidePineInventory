const fs = require('fs').promises;
const path = require('path');

exports.handler = async () => {
    try {
        const dataPath = path.resolve(__dirname, 'data.json');
        console.log('Reading data from:', dataPath);
        const data = await fs.readFile(dataPath, 'utf-8');
        console.log('Data read successfully');
        return {
            statusCode: 200,
            body: data,
        };
    } catch (error) {
        console.error('Error reading data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error reading data', error: error.message }),
        };
    }
};
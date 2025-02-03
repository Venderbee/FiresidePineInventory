const fs = require('fs').promises;
const path = require('path');

exports.handler = async () => {
    try {
        const dataPath = path.join(__dirname, 'data.json');
        const data = await fs.readFile(dataPath, 'utf-8');
        return {
            statusCode: 200,
            body: data,
        };
    } catch (error) {
        console.error('Error reading data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error reading data' }),
        };
    }
};
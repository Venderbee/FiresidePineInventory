const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
    try {
        const dataPath = path.resolve(__dirname, 'data.json');
        console.log('Writing data to:', dataPath);
        const data = JSON.parse(event.body);
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
        console.log('Data written successfully');
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Data saved successfully' }),
        };
    } catch (error) {
        console.error('Error writing data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error writing data' }),
        };
    }
};
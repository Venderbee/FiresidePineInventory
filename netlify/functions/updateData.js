exports.handler = async (event) => {
    const fetch = (await import('node-fetch')).default;

    try {
        const { REPO_OWNER, REPO_NAME, FILE_PATH, data } = JSON.parse(event.body);
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const message = 'Update data.json';
        const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64'); // Base64 encode the JSON data

        // Get the SHA of the existing file
        const fileResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });

        if (!fileResponse.ok) {
            throw new Error('Error fetching file SHA');
        }

        const fileData = await fileResponse.json();
        const sha = fileData.sha;

        // Update the file on GitHub
        const updateResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                content: content,
                sha: sha
            })
        });

        if (!updateResponse.ok) {
            throw new Error('Error saving data');
        }

        const result = await updateResponse.json();
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow all origins
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ message: 'Data saved successfully', result })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow all origins
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ message: error.message })
        };
    }
};
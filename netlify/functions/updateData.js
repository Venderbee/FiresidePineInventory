exports.handler = async (event) => {
    const fetch = (await import('node-fetch')).default;

    try {
        console.log('Received event:', event);

        const { REPO_OWNER, REPO_NAME, FILE_PATH, data } = JSON.parse(event.body);
        console.log('Parsed event body:', { REPO_OWNER, REPO_NAME, FILE_PATH, data });

        const GITHUB_TOKEN = process.env.FP_ACCESS;
        console.log("GitHub Token is set:", GITHUB_TOKEN ? "Yes" : "No");

        const message = 'Update data.json';
        const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64'); // Base64 encode the JSON data

        console.log('Fetching file SHA with:', {
            url: `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        // Get the SHA of the existing file
        const fileResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!fileResponse.ok) {
            const errorText = await fileResponse.text();
            console.error('Error fetching file SHA:', errorText);
            throw new Error('Error fetching file SHA');
        }

        const fileData = await fileResponse.json();
        const sha = fileData.sha;
        console.log('Fetched file SHA:', sha);

        // Update the file on GitHub
        const updateResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                content: content,
                sha: sha
            })
        });

        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            console.error('Error saving data:', errorText);
            throw new Error('Error saving data');
        }

        const result = await updateResponse.json();
        console.log('Data saved successfully:', result);

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
        console.error('Error in updateData function:', error.message);
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
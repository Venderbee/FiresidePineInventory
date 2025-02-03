exports.handler = async (event) => {
    const fetch = (await import('node-fetch')).default;

    try {
        console.log('🔍 Received event:', event);

        const { REPO_OWNER, REPO_NAME, FILE_PATH, data } = JSON.parse(event.body);
        console.log('📂 Parsed event body:', { REPO_OWNER, REPO_NAME, FILE_PATH });

        const GITHUB_TOKEN = process.env.FP_ACCESS;
        console.log('🔑 GitHub Token is set:', GITHUB_TOKEN ? "Yes" : "No");

        const fileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
        console.log('🌎 Fetching file from:', fileUrl);

        // Get the SHA of the existing file
        const fileResponse = await fetch(fileUrl, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        const fileText = await fileResponse.text();
        console.log('📜 Raw file response:', fileText); // Log full response for debugging

        if (!fileResponse.ok) {
            console.error('❌ Error fetching file SHA:', fileText);
            throw new Error(`GitHub API Error: ${fileResponse.status} ${fileResponse.statusText}`);
        }

        const fileData = JSON.parse(fileText);
        const sha = fileData.sha;
        console.log('✅ Fetched file SHA:', sha);

        // Update the file on GitHub
        const updateResponse = await fetch(fileUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: "Updating data.json",
                content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
                sha: sha,
                branch: 'main'
            })
        });

        const updateText = await updateResponse.text();
        console.log('📨 Update Response:', updateText);

        if (!updateResponse.ok) {
            console.error('❌ Error saving data:', updateText);
            throw new Error(`GitHub API Error: ${updateResponse.status} ${updateResponse.statusText}`);
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ message: 'Data saved successfully' })
        };

    } catch (error) {
        console.error('💥 Error in updateData function:', error.message);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ message: error.message })
        };
    }
};
const API_KEY = 'AIzaSyCws4q38ZqWT2m74wKEhGXIQ1EXyKkEo7w';
const SPREADSHEET_ID = '1nEdJlw-6wumA1jIEtVeLoO4zW5s5gkhezu8vlWp4v5c';
const RANGE = 'Stock'; // Adjust the range as needed

function loadSheetData() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
    }).then(response => {
        const rows = response.result.values;
        if (rows.length) {
            populateTable(rows);
        } else {
            console.log('No data found.');
        }
    }).catch(err => {
        console.error('Error fetching data from Google Sheet:', err);
    });
}

function populateTable(data) {
    const tableBody = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing table data

    data.forEach((row, index) => {
        if (index === 0) return; // Skip header row

        const newRow = tableBody.insertRow();
        row.forEach((cell, cellIndex) => {
            const newCell = newRow.insertCell();
            if (cellIndex === 1) { // Assuming the second column contains image URLs
                const img = document.createElement('img');
                img.src = cell; // Ensure this URL is correct
                img.alt = 'Item Image';
                img.style.width = '50px'; // Adjust the size as needed
                img.style.height = '50px'; // Adjust the size as needed
                newCell.appendChild(img);
            } else {
                newCell.textContent = cell;
            }
        });
    });
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(() => {
        loadSheetData();
    });
}

gapi.load('client', initClient);